import { ActionIcon, Box, Center, ScrollArea, Text, SegmentedControl, Space, Tooltip } from "@mantine/core";
import { style } from "./style";
import { X } from "tabler-icons-react";
// @ts-ignore
import { useDrag, useDrop } from "react-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  selectedViewState,
  useAddView,
  useRemoveView,
  useSetSelectedView,
  View,
  viewStoreState,
} from "@store/viewStore";
import { DragItemTypes } from "@util/actionTypes";
import { randomId, useHotkeys } from "@mantine/hooks";
import { useCallback, useEffect, useRef } from "react";
import { getSvgImportPath } from "@util/misc";

export function TabController() {
  const [viewStore] = useRecoilState(viewStoreState);
  const selectedView = useRecoilValue(selectedViewState);
  const setSelectedView = useSetSelectedView();
  const removeView = useRemoveView();
  const addView = useAddView();
  const { classes } = style();

  useHotkeys([
    ["ctrl+W", () => removeView(selectedView.id)],
    [
      "ctrl+Tab",
      () => {
        const currentIndex = viewStore.indexOf(selectedView);
        const nextView = viewStore[currentIndex + 1];

        if (currentIndex >= 0) {
          if (nextView) {
            setSelectedView(nextView);
          } else {
            setSelectedView(viewStore[0]);
          }
        }
      },
    ],
    [
      "ctrl+Shift+Tab",
      () => {
        const currentIndex = viewStore.indexOf(selectedView);
        const previousView = viewStore[currentIndex - 1];

        if (currentIndex >= 0) {
          if (previousView) {
            setSelectedView(previousView);
          } else {
            setSelectedView(viewStore[viewStore.length - 1]);
          }
        }
      },
    ],
  ]);

  const [, drop] = useDrop(
    () => ({
      accept: DragItemTypes.TAB,
      drop: () => {
        return { target: "background" };
      },
    }),
    [0, 0]
  );

  const findView = useCallback(
    (id: string): View => {
      return viewStore.find((view) => view.id === id)!;
    },
    [viewStore]
  );

  return (
    <ScrollArea style={{ flex: 1, zIndex: 1 }}>
      <div style={{ display: "flex" }}>
        <SegmentedControl
          onChange={(value) => setSelectedView(findView(value))}
          value={selectedView.id}
          sx={(theme) => ({
            backgroundColor: "transparent",
            "& .mantine-SegmentedControl-active": {
              boxShadow: "none",
              backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
            },
            "& label": {
              padding: "2px 4px 2px 10px",
            },
            "& label > div > div > div": {
              marginTop: 2,
            },
          })}
          data={viewStore.map((tab) => ({
            label: <SingleTab selected={selectedView.id === tab.id} tab={tab} />,
            value: tab.id,
          }))}
        />
        <div data-tauri-drag-region ref={drop} className={classes.appRegion} />
      </div>
    </ScrollArea>
  );
}

function SingleTab({ tab, selected }: { tab: View; selected: boolean }) {
  const { classes } = style();
  const remove = useRemoveView();
  const isWelcome = tab.path === "Welcome";
  const [viewStore, setViewStore] = useRecoilState(viewStoreState);
  const selectedView = useRecoilValue(selectedViewState);
  const setSelectedView = useSetSelectedView();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DragItemTypes.TAB,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (i, monitor) => {
        const result = monitor.getDropResult() as any;

        if (result) {
          const sourceIndex = viewStore.findIndex((view) => view.id === tab.id);
          const currentView = { ...selectedView };

          if (result.target === "background") {
            let newViewStore = [...viewStore];
            let temp = newViewStore.splice(sourceIndex, 1);
            newViewStore.push(temp[0]);
            setViewStore(newViewStore);
            setSelectedView(newViewStore[0]);
            setSelectedView(currentView);
          } else {
            const targetIndex = viewStore.findIndex((view) => view.id === result.id);

            if (sourceIndex >= 0 && targetIndex >= 0) {
              let newViewStore = [...viewStore];
              let temp = newViewStore.splice(sourceIndex, 1);
              newViewStore.splice(targetIndex, 0, ...temp);
              setViewStore(newViewStore);
              setSelectedView(newViewStore[0]);
              setSelectedView(currentView);
            }
          }
        }
      },
    }),
    [viewStore, selectedView, setSelectedView]
  );

  const [, drop] = useDrop(
    () => ({
      accept: [DragItemTypes.FILE, DragItemTypes.TAB],
      drop: () => {
        return tab;
      },
    }),
    [0, 0]
  );

  useEffect(() => {
    if (selected && ref.current) {
      ref.current.scrollIntoView({ block: "center", inline: "center" });
    }
  }, [selected]);

  return (
    <>
      <Tooltip ref={ref} withArrow openDelay={700} label={tab.path}>
        <div ref={!isDragging && !isWelcome ? drop : null}>
          <Center ref={!isWelcome ? drag : null} sx={{ zIndex: 2, opacity: isDragging ? 0.5 : 1 }}>
            <span className={classes.span}>
              {tab.type === "meta" ? tab.icon : <img alt="" className={classes.icon} src={tab.icon as string} />}
            </span>
            <Box ml={10}>
              <Text size="sm">{tab.label}</Text>
            </Box>
            <Space w={10} />
            <ActionIcon
              sx={{ visibility: isWelcome ? "hidden" : "visible" }}
              onClick={() => remove(tab.id)}
              mt={1}
              size={26}
            >
              <X size={12} />
            </ActionIcon>
          </Center>
        </div>
      </Tooltip>
    </>
  );
}
