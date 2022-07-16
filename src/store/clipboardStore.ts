import { useCallback } from "react";
import { atom, useRecoilValue, useRecoilState } from "recoil";
import { fileSelectionState } from "./fileSelectionStore";
import { selectedViewState } from "./viewStore";

export type ClipboardEntryType = "cut" | "copy";

export interface ClipboardEntry {
  type: ClipboardEntryType;
  path: string;
}

export const clipboardStoreState = atom<ClipboardEntry[]>({
  key: "ClipboardStoreState",
  default: [],
});

export function useCutSelection(): () => void {
  const fileSelection = useRecoilValue(fileSelectionState);
  const [, setClipboard] = useRecoilState(clipboardStoreState);

  const cutSelection = useCallback(() => {
    const selection = fileSelection.map((item) => ({
      type: "cut",
      path: item.path,
    })) as ClipboardEntry[];
    setClipboard(selection);
  }, [fileSelection]);

  return cutSelection;
}

export function useCopySelection(): () => void {
  const fileSelection = useRecoilValue(fileSelectionState);
  const [, setClipboard] = useRecoilState(clipboardStoreState);

  const cutSelection = useCallback(() => {
    const selection = fileSelection.map((item) => ({
      type: "copy",
      path: item.path,
    })) as ClipboardEntry[];
    setClipboard(selection);
  }, [fileSelection]);

  return cutSelection;
}

export function usePasteClipboard(): () => void {
  const selectedView = useRecoilValue(selectedViewState);
  const [clipboard, setClipboard] = useRecoilState(clipboardStoreState);

  const cutSelection = useCallback(() => {
    setClipboard([]);
  }, [selectedView, clipboard]);

  return cutSelection;
}
