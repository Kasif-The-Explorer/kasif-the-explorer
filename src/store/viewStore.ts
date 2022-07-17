import { randomId, useLocalStorageValue } from "@mantine/hooks";
import { WelcomePage } from "@pages/WelcomePage";
import { findIconForContent, findKindForContent, getContentScrollY, getSvgImportPath } from "@util/misc";
import React, { useCallback } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { AppWindow } from "tabler-icons-react";
import { fileSelectionState } from "./fileSelectionStore";
import { PartialViewContent } from "./quickSelectionStore";
import path from "path-browserify";
import { boardSettingsStoreState } from "./settingsStore";
import { invoke } from "@tauri-apps/api";

export interface ViewContent {
  label: string;
  icon: string | JSX.Element;
  path: string;
  id: string;
  type: ContentType;
  kind: string;
  modificationDate: Date;
  contentSize: number;
}

export type ViewType = "folder" | "meta";
export type ContentType = "folder" | "file";

export interface HistoryEntry {
  path: string;
  scrollY: number;
}

export interface View {
  label: string;
  icon: string | JSX.Element;
  path: string;
  id: string;
  type: ViewType;
  content: ViewContent[];
  defaultSort?: (cur: ViewContent, prev: ViewContent) => 1 | -1;
  defaultView?: React.ReactElement;
  defaultPage?: React.ReactElement;
  history: HistoryEntry[];
  popped: HistoryEntry[];
}

const welcome: View = {
  label: "Welcome",
  icon: React.createElement(AppWindow),
  path: "Welcome",
  id: "Welcome",
  type: "meta",
  defaultPage: React.createElement(WelcomePage),
  content: [],
  history: [],
  popped: [],
};

export const viewStoreState = atom<View[]>({
  key: "ViewStoreState",
  default: [welcome],
});

export const selectedViewState = atom<View>({
  key: "SelectedViewState",
  default: welcome,
});

export type GotoDirection = "forward" | "backward" | "direct";

export function useGoto(): (path: string, direction?: GotoDirection) => Promise<null> {
  const [viewStore, setViewStore] = useRecoilState(viewStoreState);
  const removeView = useRemoveView();
  const selectedView = useRecoilValue(selectedViewState);
  const setSelectedView = useSetSelectedView();
  const [boardSettings, setBoardSettings] = useRecoilState(boardSettingsStoreState);

  const goto = useCallback(
    async (path: string, direction?: GotoDirection): Promise<null> => {
      return new Promise((resolve) => {
        const existingViewIndex = viewStore.findIndex((view) => view.id === selectedView.id);
        const existingView = viewStore[existingViewIndex];
        const newViewStore = [...viewStore];

        createViewFromPath(path).then((view) => {
          const scrollY = getContentScrollY() || 0;
          if (direction === "forward") {
            view.history = [...selectedView.history, { path: selectedView.path, scrollY: scrollY }];
            view.popped = [...selectedView.popped];
            view.popped.pop();
          } else if (direction === "backward") {
            view.history = [...selectedView.history];
            view.history.pop();
            view.popped = [...selectedView.popped, { path: selectedView.path, scrollY: scrollY }];
          } else if (direction === "direct") {
            view.history = [...selectedView.history, { path: selectedView.path, scrollY: scrollY }];
            let newRecent = [...boardSettings.recent, view.path];
            if (newRecent.length > 10) {
              newRecent = newRecent.slice(newRecent.length - 11, newRecent.length);
            }

            setBoardSettings({ ...boardSettings, recent: newRecent });
          }

          if (existingView.path !== "Welcome") {
            newViewStore.splice(existingViewIndex, 0, view);
          } else {
            newViewStore.splice(existingViewIndex + 1, 0, view);
          }

          setViewStore(newViewStore);
          setSelectedView(view);
          if (existingView.path !== "Welcome") {
            removeView(selectedView.id, newViewStore);
          }
          resolve(null);
        });
      });
    },
    [selectedView, boardSettings, viewStore]
  );

  return goto;
}

export function useFileNavigator(): [(direction: GotoDirection) => Promise<number>, boolean, boolean, boolean] {
  const selectedView = useRecoilValue(selectedViewState);
  const parsed = path.parse(selectedView.path);
  const goto = useGoto();

  const fileNavigator = useCallback(
    async (direction: GotoDirection) => {
      switch (direction) {
        case "backward": {
          const item = selectedView.history[selectedView.history.length - 1];

          if (item) {
            await goto(item.path, "backward");
            return item.scrollY;
          }

          return 0;
        }
        case "forward": {
          const item = selectedView.popped[selectedView.popped.length - 1];

          if (item) {
            await goto(item.path, "forward");
            return item.scrollY;
          }

          return 0;
        }
        case "direct":
          if (parsed.dir) {
            await goto(parsed.dir, "direct");
          }

          return 0;
      }
    },
    [selectedView, parsed]
  );

  return [fileNavigator, selectedView.history.length > 0, selectedView.popped.length > 0, !!parsed.dir];
}

export function useSetSelectedView(): (view: View) => void {
  const [, $setSelectedView] = useRecoilState(selectedViewState);
  const [, setFileSelection] = useRecoilState(fileSelectionState);

  const setSelectedView = useCallback((view: View): void => {
    $setSelectedView(view);
    setFileSelection([]);
  }, []);

  return setSelectedView;
}

export async function createViewFromPath(viewPath: string): Promise<View> {
  // const result = await sendAsyncMessage("read-folder", { path: viewPath });
  // const content = result.message;
  // const parsed = path.parse(viewPath);
  // const label = parsed.base + parsed.ext;

  return {
    label: "label",
    icon: findIconForContent("folder", "label"),
    path: viewPath,
    id: randomId(),
    type: "folder",
    history: [],
    popped: [],
    content: [],
    // content: content.map((item: PartialViewContent) => ({
    //   ...item,
    //   id: randomId(),
    //   modificationDate: new Date(item.modificationDate),
    //   kind: findKindForContent(item.type, item.label),
    //   icon: findIconForContent(item.type, item.label),
    // })),
  };
}

export function useOpenViewContent(): (content: Pick<ViewContent, "path" | "type">) => void {
  const goto = useGoto();
  const selectedView = useRecoilValue(selectedViewState);

  const open = useCallback(
    (content: Pick<ViewContent, "path" | "type">) => {
      switch (content.type) {
        case "folder":
          goto(content.path, "direct");
          break;
        case "file":
          invoke("launch_file", { path: content.path });
          break;
      }
    },
    [selectedView]
  );

  return open;
}

export function useAddView(): (view: View) => void {
  const [viewStore, setViewStore] = useRecoilState(viewStoreState);
  const setSelectedView = useSetSelectedView();

  const add = useCallback(
    (view: View) => {
      const existingView = viewStore.find((v) => view.id === v.id);

      if (!existingView) {
        setViewStore([...viewStore, view]);
      }
      setSelectedView(view);
    },
    [viewStore]
  );

  return add;
}

export function useRemoveView(): (id: string, upToDateViewStore?: View[] | undefined) => void {
  const [viewStore, setViewStore] = useRecoilState(viewStoreState);
  const [selectedView] = useRecoilState(selectedViewState);
  const setSelectedView = useSetSelectedView();

  const remove = useCallback(
    (id: string, upToDateViewStore: View[] | undefined = undefined): void => {
      let currentViewStore: View[];
      if (upToDateViewStore) {
        currentViewStore = upToDateViewStore;
      } else {
        currentViewStore = viewStore;
      }

      if (id !== "Welcome") {
        setViewStore(currentViewStore.filter((view) => view.id !== id));
      }

      let existingTab = currentViewStore.find((tab) => tab.id === id);
      let index = currentViewStore.findIndex((tab) => tab.id === id);

      if (existingTab && id !== "Welcome") {
        if (selectedView.id === id) {
          if (currentViewStore[index - 1]) {
            setSelectedView(currentViewStore[index - 1]);
          } else {
            setSelectedView(welcome);
          }
        }
        setViewStore(currentViewStore.filter((tab) => tab.id !== id));
      }
    },
    [viewStore, selectedView]
  );

  return remove;
}

export function useGetViewContentFromElement(): (path: HTMLElement[] | HTMLElement) => ViewContent | null {
  const selectedView = useRecoilValue(selectedViewState);

  const getViewContentFromElement = useCallback(
    (path: HTMLElement[] | HTMLElement): ViewContent | null => {
      let targetElement: HTMLElement | null = null;

      if (path instanceof HTMLElement) {
        targetElement = path;
      } else {
        for (const element of path) {
          if (element.classList.contains("view-content-item")) {
            targetElement = element;
            break;
          }
        }
      }

      if (!targetElement) return null;
      const id = targetElement.getAttribute("id");
      if (!id) return null;

      const result = selectedView.content.find((viewContent) => viewContent.id === id);
      if (!result) return null;

      return result;
    },
    [selectedView]
  );

  return getViewContentFromElement;
}
