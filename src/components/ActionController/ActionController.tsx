import { SearchController } from "@components/SearchController";
import { randomId, useHotkeys } from "@mantine/hooks";
import { GotoDirection, selectedViewState, useFileNavigator, useGoto } from "@store/viewStore";
import { viewAnimationStore } from "@hooks/useTransition";
import { getContentScrollY, setContentScrollY } from "@util/misc";
import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  ArrowLeft,
  ChevronRight,
  ArrowRight,
  ArrowUp,
  CirclePlus,
  Refresh,
  Terminal2,
  BrandVisualStudio,
  Copy,
  Icon,
} from "tabler-icons-react";
import { Text, ActionIcon, Group, Input, Menu, Tooltip, Progress, UnstyledButton } from "@mantine/core";
import { style } from "./style";

export interface WorkspaceAction {
  onTrigger: () => void;
  icon: Icon;
  description: string;
}

export function ActionController() {
  const { classes } = style();
  const selectedView = useRecoilValue(selectedViewState);
  const [pathValue, setPathValue] = useState(selectedView.path);
  const [, setViewAnimationId] = useRecoilState(viewAnimationStore);
  const [pathIsInput, setPathIsInput] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(Date.now());
  const [progress, setProgress] = useState(0);
  const goto = useGoto();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileNavigator, goBackAvailable, goForwardAvailable, goUpAvailable] = useFileNavigator();

  useEffect(() => {
    setPathValue(selectedView.path);
  }, [selectedView.path]);

  const handleRefresh = useCallback((event: any) => {
    if (event.nativeEvent.ctrlKey) {
      location.reload();
    } else {
      setViewAnimationId(randomId());
    }
  }, []);

  const parsedPath = pathValue.split("/");
  const handlePathPartClick = useCallback(
    (index: number) => {
      const now = Date.now();
      if (now - lastClickTime > 350) {
        // list possible sibling routes
      } else {
        const newPath = parsedPath.slice(0, index + 1).join("/");
        if (selectedView.path !== newPath) {
          goto(newPath, "direct");
        }
      }
    },
    [selectedView, lastClickTime]
  );

  const updatePathIsInput = useCallback(
    (value: boolean) => {
      setPathIsInput(value);

      if (value && inputRef.current) {
        inputRef.current.focus();
      }
    },
    [inputRef]
  );

  const workspaceActions: WorkspaceAction[] = useMemo(
    () => [
      { icon: Copy, onTrigger: () => {}, description: "Duplicate View" },
      { icon: BrandVisualStudio, onTrigger: () => {}, description: "Open VSCode Here" },
      { icon: Terminal2, onTrigger: () => {}, description: "Open Terminal Here" },
    ],
    []
  );

  const handleNavigation = useCallback(
    async (type: GotoDirection) => {
      const scrollTop = await fileNavigator(type);
      setContentScrollY(scrollTop);
    },
    [selectedView]
  );

  const mousePopPushHandler = useCallback(
    (e: MouseEvent) => {
      switch (e.button) {
        case 3:
          if (goBackAvailable) handleNavigation("backward");
          break;
        case 4:
          if (goForwardAvailable) handleNavigation("forward");
          break;
        default:
          break;
      }
    },
    [goBackAvailable, goForwardAvailable, selectedView]
  );

  useEffect(() => {
    window.addEventListener("mouseup", mousePopPushHandler);

    return () => {
      window.removeEventListener("mouseup", mousePopPushHandler);
    };
  }, [mousePopPushHandler]);

  useHotkeys([
    ["alt+ArrowLeft", () => handleNavigation("backward")],
    ["alt+ArrowRight", () => handleNavigation("forward")],
  ]);

  return (
    <Group sx={{ gap: 0 }} className={classes.wrapper}>
      <Group mt={6} px="md" sx={(theme) => ({ gap: theme.spacing.xs })} className={classes.top}>
        <Group sx={(theme) => ({ gap: theme.spacing.xs })}>
          <Tooltip openDelay={700} label="Back">
            <ActionIcon onClick={() => handleNavigation("backward")} disabled={!goBackAvailable} size="md">
              <ArrowLeft size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip openDelay={700} label="Forward">
            <ActionIcon onClick={() => handleNavigation("forward")} disabled={!goForwardAvailable} size="md">
              <ArrowRight size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip openDelay={700} label="Up">
            <ActionIcon onClick={() => handleNavigation("direct")} disabled={!goUpAvailable} size="md">
              <ArrowUp size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip openDelay={700} label="Refresh">
            <ActionIcon onClick={handleRefresh} size="md">
              <Refresh size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <div onDoubleClick={() => updatePathIsInput(true)} className={classes.pathWrapper}>
          {!pathIsInput && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                width: "100%",
              }}
            >
              {parsedPath.map((dir, i) => (
                <span key={i} style={{ height: "100%", display: "flex", alignItems: "center" }}>
                  <UnstyledButton
                    onMouseDown={() => setLastClickTime(Date.now())}
                    onMouseUp={() => handlePathPartClick(i)}
                    className={classes.pathButton}
                  >
                    {dir}
                  </UnstyledButton>
                  {i !== parsedPath.length - 1 && <ChevronRight className={classes.pathDivider} size={14} />}
                </span>
              ))}
            </div>
          )}
          {pathIsInput && (
            <Input
              ref={inputRef}
              sx={(theme) => ({
                width: "100%",
                "& input": {
                  height: 30,
                  minHeight: 30,
                  lineHeight: 30,
                  fontSize: theme.fontSizes.sm,
                },
                "& input:focus": { border: "1px solid transparent !important" },
              })}
              spellCheck="false"
              autoComplete="off"
              onChange={(e: any) => setPathValue(e.target.value)}
              onBlur={() => updatePathIsInput(false)}
              variant="filled"
              placeholder="Folder path"
              value={pathValue}
            />
          )}
        </div>
        <SearchController />

        <Group sx={(theme) => ({ gap: theme.spacing.xs })}>
          {workspaceActions.map((action, i) => (
            <Tooltip key={i} label={action.description}>
              <ActionIcon onClick={action.onTrigger} disabled={selectedView.type === "meta"} size="md">
                <action.icon size={18} />
              </ActionIcon>
            </Tooltip>
          ))}
          <Tooltip label="Custom Actions">
            <Menu>
              <Menu.Item>
                <Text size="xs">Custom Action 1</Text>
              </Menu.Item>
              <Menu.Item>
                <Text size="xs">Custom Action 2</Text>
              </Menu.Item>
              <Menu.Item icon={<CirclePlus size={14} />} color="blue">
                <Text size="xs">Add Custom Actions</Text>
              </Menu.Item>
            </Menu>
          </Tooltip>
        </Group>
      </Group>
      <Progress mt={5} sx={{ width: "100%", height: 1 }} value={progress} />
    </Group>
  );
}
