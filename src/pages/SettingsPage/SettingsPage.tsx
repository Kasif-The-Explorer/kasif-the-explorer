import { Input, Select, Stack, Switch, Title, Button, useMantineColorScheme } from "@mantine/core";
import { ContentItem } from "@components/ContentItem";
import { createFallDown } from "@util/misc";
import { useRecoilState } from "recoil";
import { appSettingsStoreState } from "@store/settingsStore";
import { TransitionWrapper } from "@components/TransitionWrapper";
import { useMemo } from "react";

export interface SettingsItem {
  color: string;
  title: string;
  description: string;
  action: React.ReactNode;
}

export function SettingsPage() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [settings, setSettings] = useRecoilState(appSettingsStoreState);

  const settingItems: SettingsItem[] = useMemo(
    () => [
      {
        color: "blue",
        title: "Dark UI Theme",
        description: "Use dark theme for the Kâşif UI.",
        action: <Switch onChange={() => toggleColorScheme()} checked={colorScheme === "dark"} />,
      },
      {
        color: "blue",
        title: "Quick Selection Item Size",
        description: "Choose a size type for the quick selection items on the left",
        action: (
          <Select
            placeholder="Pick one"
            defaultValue={settings.quickSelectionSize.toString()}
            onChange={(size) =>
              setSettings({ ...settings, quickSelectionSize: parseInt(size!)! || 6 })
            }
            data={[
              { value: "2", label: "Dense" },
              { value: "6", label: "Normal" },
              { value: "10", label: "Large" },
            ]}
          />
        ),
      },
      {
        color: "blue",
        title: "Content Item Size",
        description: "Choose a size type for the view items.",
        action: (
          <Select
            placeholder="Pick one"
            defaultValue={settings.itemSize.toString()}
            onChange={(size) => setSettings({ ...settings, itemSize: parseInt(size!)! || 30 })}
            data={[
              { value: "26", label: "Dense" },
              { value: "32", label: "Normal" },
              { value: "40", label: "Large" },
            ]}
          />
        ),
      },
      {
        color: "blue",
        title: "UI Font",
        description: "Choose one of the available fonts for the Kâşif UI.",
        action: (
          <Select
            placeholder="Pick one"
            defaultValue={settings.uiFont}
            onChange={(uiFont) => setSettings({ ...settings, uiFont: uiFont! })}
            data={[
              { value: "Ubuntu", label: "Ubuntu", group: "Sans Serif" },
              { value: "Roboto", label: "Roboto", group: "Sans Serif" },
              { value: "Poppins", label: "Poppins", group: "Sans Serif" },
              { value: "Montserrat", label: "Montserrat", group: "Sans Serif" },
              { value: "Oswald", label: "Oswald", group: "Sans Serif" },
              { value: "Open Sans", label: "Open Sans", group: "Sans Serif" },
              { value: "Playfair Display", label: "Playfair Display", group: "Serif" },
              { value: "Inconsolata", label: "Inconsolata", group: "Monospace" },
            ]}
          />
        ),
      },
      {
        color: "yellow",
        title: "Turn Off Opt-in Animations",
        description: "Turn off some the animations for a performance boost.",
        action: (
          <Switch
            onChange={() =>
              setSettings({ ...settings, turnOffOptinAnimations: !settings.turnOffOptinAnimations })
            }
            checked={settings.turnOffOptinAnimations}
          />
        ),
      },
      {
        color: "yellow",
        title: "Ask Before Delete",
        description: "Ask to ensure before deleting any item.",
        action: (
          <Switch
            onChange={() =>
              setSettings({ ...settings, askBeforeDelete: !settings.askBeforeDelete })
            }
            checked={settings.askBeforeDelete}
          />
        ),
      },
      {
        color: "orange",
        title: "Enable Extensive Details",
        description:
          "Enable extensive details like content preview and git timeline for files and folders.",
        action: (
          <Switch
            onChange={() =>
              setSettings({ ...settings, extensiveDetails: !settings.extensiveDetails })
            }
            checked={settings.extensiveDetails}
          />
        ),
      },
      {
        color: "orange",
        title: "Allow Overflow Navigation",
        description:
          "Allow navigation with arrow keys even after hitting content boundries.",
        action: (
          <Switch
            onChange={() =>
              setSettings({ ...settings, allowOverflowNavigation: !settings.allowOverflowNavigation })
            }
            checked={settings.allowOverflowNavigation}
          />
        ),
      },
      {
        color: "orange",
        title: "Open To Lan",
        description: "Create a local network with which you can use the Kâşif Web App.",
        action: <Button>Open</Button>,
      },
    ],
    [settings, colorScheme]
  );

  return (
    <Stack p="xs">
      <Title
        sx={(theme) => ({
          marginTop: `${theme.spacing.xs}px !important`,
          marginBottom: "0 !important",
        })}
        order={2}
      >
        Settings
      </Title>
      <Stack sx={(theme) => ({ gap: theme.spacing.xs })}>
        {settingItems.map((item, i) => (
          <TransitionWrapper
            key={i}
            transition={createFallDown(i, settingItems.length)}
            duration={300}
          >
            {(styles) => (
              <ContentItem
                color={item.color}
                style={styles}
                title={item.title}
                description={item.description}
              >
                {item.action}
              </ContentItem>
            )}
          </TransitionWrapper>
        ))}
      </Stack>
    </Stack>
  );
}
