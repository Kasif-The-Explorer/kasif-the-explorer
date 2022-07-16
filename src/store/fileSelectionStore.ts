import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";
import { ViewContent } from "./viewStore";

export const fileSelectionState = atom<ViewContent[]>({
  key: "FileSelectionStateStore",
  default: [],
});

export function useAddSelection(): (content: ViewContent | ViewContent[]) => void {
  const [fileSelection, setFileSelection] = useRecoilState(fileSelectionState);

  const add = useCallback(
    (content: ViewContent | ViewContent[]) => {
      if (content.constructor === Array) {
        let _content: ViewContent[] = content as ViewContent[];
        let result: ViewContent[] = [];

        for (const item of _content) {
          const existingSelection = fileSelection.find((selection) => selection.path === item.path);
          if (!existingSelection) {
            result.push(item);
          }
        }

        setFileSelection([...fileSelection, ...result]);
      } else {
        let _content: ViewContent = content as ViewContent;
        const existingSelection = fileSelection.find(
          (selection) => selection.path === _content.path
        );
        if (!existingSelection) {
          setFileSelection([...fileSelection, _content]);
        }
      }
    },
    [fileSelection]
  );

  return add;
}

export function useRemoveSelection(): (value: string) => void {
  const [fileSelection, setFileSelection] = useRecoilState(fileSelectionState);

  const remove = useCallback(
    (value: string) => {
      setFileSelection(fileSelection.filter((selection) => selection.path !== value));
    },
    [fileSelection]
  );

  return remove;
}

export const fileRenameState = atom<ViewContent | null>({
  key: "FileRenameStateStore",
  default: null,
});
