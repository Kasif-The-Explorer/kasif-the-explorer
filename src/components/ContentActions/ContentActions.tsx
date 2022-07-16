import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { fileRenameState, fileSelectionState } from "@store/fileSelectionStore";
import { appSettingsStoreState, useTogglePin } from "@store/settingsStore";
import { useRecoilState, useRecoilValue } from "recoil";
import { useModals } from "@mantine/modals";
import {
  Cut,
  Copy,
  CursorText,
  Trash,
  LayoutDashboard,
  Settings,
  Clipboard,
  Pin,
} from "tabler-icons-react";
import { style } from "./style";
import { useCallback } from "react";
import { useHotkeys } from "@mantine/hooks";
import {
  clipboardStoreState,
  useCopySelection,
  useCutSelection,
  usePasteClipboard,
} from "@store/clipboardStore";

export function ContentActions() {
  const modals = useModals();
  const [selections, setSelections] = useRecoilState(fileSelectionState);
  const appSettings = useRecoilValue(appSettingsStoreState);
  const [togglePin, isPinned] = useTogglePin();
  const fileSelection = useRecoilValue(fileSelectionState);
  const cutSelection = useCutSelection();
  const copySelection = useCopySelection();
  const pasteClipboard = usePasteClipboard();
  const [renamedFile, setRenamedFile] = useRecoilState(fileRenameState);
  const [clipboard, setClipboard] = useRecoilState(clipboardStoreState);

  const renameSelection = useCallback(() => {
    if (fileSelection.length > 0) {
      if (renamedFile === null || renamedFile.path !== fileSelection[0].path) {
        setRenamedFile(fileSelection[0]);
      }
    }
  }, [fileSelection, renamedFile]);

  const deleteSelection = useCallback(() => {
    if (appSettings.askBeforeDelete && selections.length > 0) {
      modals.openConfirmModal({
        title: "Are You Sure?",
        centered: true,
        children: (
          <Text size="sm">
            Are you sure you want to delete this {selections.length === 1 ? "item" : "items"}? This
            action is irreversible.
          </Text>
        ),
        labels: { confirm: "Delete", cancel: "Cancel" },
        confirmProps: { color: "red" },
        onCancel: () => console.log("Cancel"),
        onConfirm: () => console.log("Confirmed"),
      });
    }
  }, [selections, appSettings.askBeforeDelete]);

  useHotkeys([
    ["delete", deleteSelection],
    ["f2", renameSelection],
    ["ctrl+c", copySelection],
    ["ctrl+v", pasteClipboard],
    ["ctrl+x", cutSelection],
    [
      "escape",
      () => {
        setClipboard([]);
        setSelections([]);
      },
    ],
  ]);

  const { classes } = style();
  return (
    <Group px="md" className={classes.wrapper}>
      <Group sx={(theme) => ({ gap: theme.spacing.xs })}>
        <Tooltip label="Cut">
          <ActionIcon onClick={cutSelection} disabled={selections.length < 1}>
            <Cut size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip onClick={copySelection} label="Copy">
          <ActionIcon disabled={selections.length < 1}>
            <Copy size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Paste">
          <ActionIcon onClick={pasteClipboard} disabled={clipboard.length === 0}>
            <Clipboard size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Rename">
          <ActionIcon onClick={renameSelection} disabled={selections.length !== 1}>
            <CursorText size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon onClick={deleteSelection} disabled={selections.length < 1}>
            <Trash size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Group sx={(theme) => ({ gap: theme.spacing.xs })}>
        <Tooltip label={isPinned ? "Unpin From Board" : "Pin To Board"}>
          <ActionIcon onClick={togglePin}>
            <Pin size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Change Layout">
          <ActionIcon>
            <LayoutDashboard size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Folder Properties">
          <ActionIcon>
            <Settings size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}
