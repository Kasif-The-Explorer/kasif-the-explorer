import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "@pages/HomePage";
import { LoginPage } from "@pages/LoginPage";
import { MainLayout } from "@layouts/MainLayout";
import { useHotkeys, randomId, useLocalStorageValue } from "@mantine/hooks";
import { viewAnimationStore } from "@hooks/useTransition";
import { useRecoilState } from "recoil";
import { useMantineTheme } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { getQuickSelectionItems, quickSelectionState } from "@store/quickSelectionStore";
import { boardSettingsStoreState } from "@store/settingsStore";

function App() {
  const [, setViewAnimationId] = useRecoilState(viewAnimationStore);
  const theme = useMantineTheme();
  const [ready, setReady] = useState(false);
  const [, setQuickSelectionState] = useRecoilState(quickSelectionState);
  const [pinnedItems, setPinnedItems] = useLocalStorageValue<string[]>({
    key: "pinned-items",
    defaultValue: [],
  });
  const [recentItems, setRecentItems] = useLocalStorageValue<string[]>({
    key: "recent-items",
    defaultValue: [],
  });
  const [boardSettings, setBoardSettings] = useRecoilState(boardSettingsStoreState);

  useHotkeys([
    ["ctrl+R", () => setViewAnimationId(randomId())],
    ["f5", () => setViewAnimationId(randomId())],
    ["ctrl+shift+R", () => location.reload()],
  ]);

  useEffect(() => {
    if (
      JSON.stringify(pinnedItems) !== JSON.stringify(boardSettings.pinned) ||
      JSON.stringify(recentItems) !== JSON.stringify(boardSettings.recent)
    ) {
      setBoardSettings({ pinned: pinnedItems, recent: recentItems });
    }
  }, [recentItems, pinnedItems]);

  useEffect(() => {
    setPinnedItems(boardSettings.pinned);
    setRecentItems(boardSettings.recent);
  }, [boardSettings]);

  useEffect(() => {
    getQuickSelectionItems(boardSettings.pinned, boardSettings.recent).then((items) => {
      setQuickSelectionState(items);
      setReady(true);
    });
    setReady(true);
  }, [boardSettings]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
      }}
      className="app"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<MainLayout ready={ready} />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
