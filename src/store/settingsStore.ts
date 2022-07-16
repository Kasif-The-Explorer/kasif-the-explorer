import { useCallback } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { selectedViewState, View } from "./viewStore";

export interface AppSettings {
  quickSelectionSize: number;
  itemSize: number;
  uiFont: string;
  extensiveDetails: boolean;
  turnOffOptinAnimations: boolean;
  displayEditorButton: boolean;
  askBeforeDelete: boolean;
  allowOverflowNavigation: boolean;
}

export const defaultAppSettings = {
  quickSelectionSize: 6,
  itemSize: 32,
  uiFont: "Ubuntu",
  extensiveDetails: false,
  turnOffOptinAnimations: true,
  displayEditorButton: false,
  askBeforeDelete: true,
  allowOverflowNavigation: false,
};

export const appSettingsStoreState = atom<AppSettings>({
  key: "AppSettingsStoreState",
  default: defaultAppSettings,
});

export type ViewType = "details" | "basic" | "icons";
export type ViewSize = "small" | "medium" | "large";
export interface ViewOrderBy {
  label: "name" | "modificationDate" | "type" | "size";
  sort: (previous: View, current: View) => -1 | 1;
}

export const ViewOrderByEnum: Record<ViewOrderBy["label"], ViewOrderBy> = {
  name: {
    label: "name",
    sort: (previous: View, current: View) => {
      return 1;
    },
  },
  modificationDate: {
    label: "modificationDate",
    sort: (previous: View, current: View) => {
      return 1;
    },
  },
  type: {
    label: "type",
    sort: (previous: View, current: View) => {
      return 1;
    },
  },
  size: {
    label: "size",
    sort: (previous: View, current: View) => {
      return 1;
    },
  },
};

export interface ViewSettings {
  selectedViewType: ViewType;
  viewSize: ViewSize;
  orderBy: ViewOrderBy;
}

export const viewSettingsStoreState = atom<ViewSettings>({
  key: "ViewSettingsStoreState",
  default: {
    selectedViewType: "details",
    viewSize: "small",
    orderBy: ViewOrderByEnum["name"],
  },
});

export interface BoardSettings {
  pinned: string[];
  recent: string[];
}

export const boardSettingsStoreState = atom<BoardSettings>({
  key: "BoardSettingsStoreState",
  default: {
    pinned: [],
    recent: [],
  },
});

export function useTogglePin(): [() => void, boolean] {
  const selectedView = useRecoilValue(selectedViewState);
  const [boardSettings, setBoardSettings] = useRecoilState(boardSettingsStoreState);
  const isPinned = boardSettings.pinned.includes(selectedView.path);

  const togglePin = useCallback(() => {
    if (isPinned) {
      setBoardSettings({
        ...boardSettings,
        pinned: boardSettings.pinned.filter((item) => item !== selectedView.path),
      });
    } else {
      setBoardSettings({ ...boardSettings, pinned: [...boardSettings.pinned, selectedView.path] });
    }
  }, [boardSettings, selectedView]);

  return [togglePin, isPinned];
}
