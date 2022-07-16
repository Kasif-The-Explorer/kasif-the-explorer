import { Rect, SelectorCanvas } from "@components/Views/SelectorCanvas";
import { randomId, useHotkeys, useMergedRef } from "@mantine/hooks";
import { useCallback, useMemo, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { style } from "./style";
import { computeElementCollision } from "../SelectorCanvas/vector";
import { findIconForContent, minMax } from "@util/misc";
import { ExtensiveDetails } from "@components/ExtensiveDetails";
import { getContentScrollY } from "@util/misc";
import { appSettingsStoreState } from "@store/settingsStore";
import { Input, ScrollArea } from "@mantine/core";
import { ContentActions } from "@components/ContentActions";
import { DragItemTypes } from "@util/actionTypes";
import { DragPreviewImage, useDrag, useDrop } from "react-dnd";
import { clipboardStoreState } from "@store/clipboardStore";
import { useMenuStates, useContextMenu } from "@store/contextMenuStore";
import { fileRenameState, fileSelectionState, useAddSelection, useRemoveSelection } from "@store/fileSelectionStore";
import { selectedViewState, useGetViewContentFromElement, useOpenViewContent, ViewContent } from "@store/viewStore";

export function BaseView(props: { children: JSX.Element; width: number; height: number }) {
  const { classes } = style();
  const getViewContentFromElement = useGetViewContentFromElement();
  const selectedView = useRecoilValue(selectedViewState);
  const settings = useRecoilValue(appSettingsStoreState);
  const [fileSelection, setFileSelection] = useRecoilState(fileSelectionState);
  const addSelection = useAddSelection();
  const open = useOpenViewContent();
  const ref = useRef<HTMLDivElement>(null);
  const { folderViewMenuState } = useMenuStates();

  const handleContextMenu = useCallback(() => {
    setFileSelection([]);
  }, []);

  const contextRef = useContextMenu<HTMLDivElement>({ type: folderViewMenuState }, handleContextMenu);

  useHotkeys([
    ["ctrl+A", () => setFileSelection(selectedView.content)],
    [
      "ctrl+shift+A",
      () =>
        setFileSelection(
          selectedView.content.filter((view) => !fileSelection.map((selection) => selection.id).includes(view.id))
        ),
    ],
    ["ctrl+D", () => setFileSelection([])],
    [
      "enter",
      (e) => {
        e.preventDefault();
        if (fileSelection.length > 0) {
          open(fileSelection.at(-1)!);
        }
      },
    ],
    [
      "arrowUp",
      () => {
        if (fileSelection.length === 1) {
          const index = selectedView.content.findIndex((item) => item.path === fileSelection[0].path);

          if (index > 0) {
            setFileSelection([selectedView.content[index - 1]]);
          } else if (index === 0 && settings.allowOverflowNavigation) {
            setFileSelection([selectedView.content.at(-1)!]);
          }
        }
      },
    ],
    [
      "arrowDown",
      () => {
        if (fileSelection.length === 1) {
          const index = selectedView.content.findIndex((item) => item.path === fileSelection[0].path);

          if (index >= 0 && index < selectedView.content.length - 1) {
            setFileSelection([selectedView.content[index + 1]]);
          } else if (index === selectedView.content.length - 1 && settings.allowOverflowNavigation) {
            setFileSelection([selectedView.content[0]]);
          }
        }
      },
    ],
  ]);

  const onAreaUpdate = useCallback(
    async (area: Rect, ctrlKey: boolean) => {
      let collisions: ViewContent[] = [];
      if (ref.current) {
        const content = Array.from(document.querySelectorAll(".view-content-item")) as HTMLElement[];
        for (const item of content) {
          const collides = computeElementCollision(ref.current, item, area);
          if (collides) {
            let viewContent = getViewContentFromElement(item);
            if (viewContent) {
              collisions.push(viewContent);
            }
          }
        }
      }
      if (ctrlKey) {
        addSelection(collisions);
      } else {
        setFileSelection(collisions);
      }
    },
    [fileSelection, addSelection, setFileSelection, selectedView]
  );

  return (
    <div ref={contextRef}>
      <ContentActions />
      <div className="view-scroll-area" style={{ display: "flex" }}>
        <div style={{ flex: 2 }}>
          <SelectorCanvas onAreaUpdate={onAreaUpdate} width={props.width} height={props.height} />
          <div ref={ref} className={classes.wrapper}>
            {props.children}
          </div>
        </div>
        {settings.extensiveDetails && selectedView.type === "folder" && (
          <CustomScrollArea flex={1}>
            <div className={classes.details}>
              <ExtensiveDetails />
            </div>
          </CustomScrollArea>
        )}
      </div>
    </div>
  );
}

function CustomScrollArea({ flex, children }: { flex: number; children: React.ReactNode }) {
  return (
    <ScrollArea
      style={{ flex }}
      className="view-scroll-area"
      sx={{
        height: "calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))",
      }}
    >
      {children}
    </ScrollArea>
  );
}

export interface BaseItemProps extends ViewContent {
  children: React.ReactNode;
}

export function BaseItem(props: BaseItemProps) {
  const [fileSelection, setFileSelection] = useRecoilState(fileSelectionState);
  const clipboard = useRecoilValue(clipboardStoreState);
  const selectedView = useRecoilValue(selectedViewState);
  const [renamedFile, setRenamedFile] = useRecoilState(fileRenameState);
  const addSelection = useAddSelection();
  const removeSelection = useRemoveSelection();
  const openViewContent = useOpenViewContent();
  const { fileItemMenuState, folderItemMenuState } = useMenuStates();
  const [clickDate, setClickDate] = useState(Date.now());
  const isSelected = useMemo(
    () => fileSelection.map((selection) => selection.id).includes(props.id),
    [fileSelection, props.id]
  );

  const handleContextMenu = useCallback(() => {
    addSelection(props);
  }, [fileSelection]);

  const contextRef = useContextMenu<HTMLDivElement>(
    { type: props.type === "file" ? fileItemMenuState : folderItemMenuState },
    handleContextMenu
  );

  const [, drag, preview] = useDrag(() => ({
    type: DragItemTypes.FILE,
    item: { id: randomId() },
    end: (i, monitor) => {
      const result = monitor.getDropResult() as any;

      if (result && props.path !== result.path) {
        console.log("move", props.path, "to", result.path);
      }
    },
  }));

  const [, drop] = useDrop(
    () => ({
      accept: DragItemTypes.FILE,
      drop: () => props,
    }),
    [0, 0]
  );

  const ref = useMergedRef(drag, contextRef);

  const handleClick = useCallback(
    (event: any) => {
      if (event.shiftKey) {
        event.preventDefault();
        let lastItem = fileSelection[fileSelection.length - 1];

        if (lastItem) {
          const targetIndex = selectedView.content.findIndex((item) => item.path === lastItem.path);
          const currentIndex = selectedView.content.findIndex((item) => item.path === props.path);
          const [min, max] = minMax([targetIndex, currentIndex]);
          const list = selectedView.content.slice(min, max + 1);
          addSelection(list);
        }
        return;
      }

      if (event.ctrlKey) {
        if (isSelected) {
          removeSelection(props.path);
        } else {
          addSelection(props);
        }
      } else {
        if (!isSelected) {
          setFileSelection([props]);
        } else {
          if (fileSelection.length > 1) {
            setFileSelection([props]);
          } else {
            const elapsedTime = Date.now() - clickDate;
            const renamePredicate = elapsedTime > 500 && elapsedTime < 2000;
            if (renamePredicate && (renamedFile === null || renamedFile.path !== props.path)) {
              setRenamedFile(props);
            }
          }
        }
        setClickDate(Date.now());
      }
    },
    [isSelected, fileSelection, clickDate, selectedView]
  );

  const handleDoubleClick = useCallback(() => {
    openViewContent(props);
  }, [props]);

  const isCut = useMemo(
    () =>
      clipboard
        .filter((entry) => entry.type === "cut")
        .map((entry) => entry.path)
        .includes(props.path),
    [props.path, clipboard]
  );

  return (
    <div
      id={props.id}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className="non-drag-target view-content-item"
      draggable="true"
      style={{ width: "100%", height: "100%", opacity: isCut ? 0.5 : 1 }}
      ref={ref}
    >
      <DragPreviewImage src={findIconForContent(props.type, props.label, true)} connect={preview} />
      <span ref={props.type === "folder" ? drop : null}>{props.children}</span>
    </div>
  );
}

export function RenameInput({ value, className }: { value: string; className: string }) {
  const [renamedFile, setRenamedFile] = useRecoilState(fileRenameState);
  const [inputValue, setInputValue] = useState(value);

  const handleInputFocus: React.FocusEventHandler<HTMLInputElement> = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleRenameKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case "Enter":
          // Handle renaming
          setRenamedFile(null);
          break;
        case "Escape":
          setRenamedFile(null);
          break;
        default:
          break;
      }
    },
    [renamedFile, inputValue]
  );

  return (
    <Input
      autoFocus
      spellCheck={false}
      onFocus={handleInputFocus}
      onBlur={() => setRenamedFile(null)}
      className={className}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleRenameKeyDown}
      defaultValue={value}
    />
  );
}
