import "./index.css";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  MantineProvider,
  ColorSchemeProvider,
  TypographyStylesProvider,
  useMantineTheme,
  MantineTheme,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { SpotlightProvider } from "@mantine/spotlight";
import { DndProvider } from "react-dnd";
import { useLocalStorage, useToggle } from "@mantine/hooks";
import { RecoilRoot, useRecoilState } from "recoil";
import { ContextGuard } from "@guards/ContextGuard";
import { Search } from "tabler-icons-react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSpotlightActions } from "@hooks/spotlight";
import { AppSettings, appSettingsStoreState, defaultAppSettings } from "@store/settingsStore";
import { CustomSpotlightAction, CustomActionsWrapper } from "@components/CustomSpotlightAction";
import { InfoModal } from "@components/Modals";
import App from "./App";
import { appWindow } from "@tauri-apps/api/window";

type ColorScheme = "dark" | "light";
type Color = [string, string, string, string, string, string, string, string, string, string];
const colors: { [key: string]: Color } = {
  blue: ["#EEFBFC", "#CBF3F6", "#A8EBF0", "#85E4EA", "#62DCE4", "#3FD4DE", "#23C6D1", "#21B5C0", "#1B949D", "#15737A"],
  // blue: ["#EBF7FF", "#C2E7FF", "#99D6FF", "#70C6FF", "#47B6FF", "#1FA5FF", "#0093F5", "#007ACC", "#0062A3", "#00497A"],
  // blue: ["#F2F8F6", "#D7EAE3", "#BCDCD0", "#A1CEBD", "#87C0AA", "#6CB297", "#54A083", "#46866D", "#3F7862", "#386B58"],
};

function setCssVariables(colorScheme: ColorScheme, theme: MantineTheme) {
  const root = document.querySelector(":root")! as HTMLElement;
  let selectionColor: string;

  switch (colorScheme) {
    case "dark":
      selectionColor = theme.fn.rgba(colors.blue[8], 0.7);
      root.style.setProperty("--selection-color", selectionColor);
      root.style.setProperty("--scrollbar-track-color", theme.colors.dark[8]);
      root.style.setProperty("--scrollbar-thumb-color", theme.fn.rgba("#ffffff", 0.4));
      root.style.setProperty("--scrollbar-thumb-hover-color", theme.fn.rgba("#ffffff", 0.5));
      root.style.setProperty("--blur-background-color", theme.fn.rgba(theme.colors.dark[7], 1));
      break;
      case "light":
      selectionColor = theme.fn.rgba(colors.blue[0], 0.7);
      root.style.setProperty("--selection-color", selectionColor);
      root.style.setProperty("--scrollbar-track-color", theme.colors.gray[0]);
      root.style.setProperty("--scrollbar-thumb-color", theme.fn.rgba("#000000", 0.4));
      root.style.setProperty("--scrollbar-thumb-hover-color", theme.fn.rgba("#000000", 0.5));
      root.style.setProperty("--blur-background-color", theme.fn.rgba(theme.white, 1));
      break;
  }
}

function UI() {
  const [schemeStore, setSchemeStore] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "light",
  });
  const [scheme, toggle] = useToggle<ColorScheme>(schemeStore, ["dark", "light"]);
  const theme = useMantineTheme();

  const [settingsStore, setSettingsStore] = useLocalStorage<AppSettings>({
    key: "app-settings",
    defaultValue: defaultAppSettings,
  });
  const [settings, setSettings] = useRecoilState(appSettingsStoreState);
  const spotlightActions = useSpotlightActions();

  useEffect(() => {
    setSettingsStore(settings);
  }, [settings]);

  useEffect(() => {
    setSchemeStore(scheme);
    setCssVariables(scheme, theme);
  }, [scheme]);

  useEffect(() => {
    if (scheme !== schemeStore) {
      toggle();
    }
  }, [schemeStore]);

  useEffect(() => {
    if (JSON.stringify(settings) !== JSON.stringify(settingsStore)) {
      setSettings(settingsStore);
    }
  }, [settingsStore]);

  const toggleColorScheme = () => {
    toggle();
  };

  if (!settings) {
    return <p>loading...</p>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <MantineProvider
        theme={{
          fontFamily: settings.uiFont,
          headings: {
            fontFamily: settings.uiFont,
            fontWeight: 600,
          },
          colorScheme: scheme,
          colors: colors,
        }}
      >
        <SpotlightProvider
          actions={spotlightActions}
          searchPlaceholder="Search..."
          highlightQuery
          shortcut="mod + k"
          nothingFoundMessage="Nothing found"
          actionsWrapperComponent={CustomActionsWrapper}
          actionComponent={CustomSpotlightAction}
          searchIcon={<Search size={18} />}
        >
          <NotificationsProvider>
            {/* @ts-ignore */}
            <ModalsProvider modals={{ "info-modal": InfoModal }}>
              <ColorSchemeProvider toggleColorScheme={toggleColorScheme} colorScheme={scheme}>
                <TypographyStylesProvider>
                  <App />
                </TypographyStylesProvider>
              </ColorSchemeProvider>
            </ModalsProvider>
          </NotificationsProvider>
        </SpotlightProvider>
      </MantineProvider>
    </DndProvider>
  );
}

const container = document.getElementById("root")!;
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ContextGuard>
      <RecoilRoot>
        <UI />
      </RecoilRoot>
    </ContextGuard>
  </React.StrictMode>
);
