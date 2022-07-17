import { Divider, Menu, Kbd, Overlay } from "@mantine/core";
import { contextMenuState, MenuDivider, MenuItem, MenuLabel } from "@store/contextMenuStore";
import { fileSelectionState } from "@store/fileSelectionStore";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { style } from "./style";

export function CustomKbd(props: any) {
  return (
    <Kbd sx={{ padding: "2px 5px", fontSize: 10 }} color="dimmed">
      {props.children}
    </Kbd>
  );
}

export interface Position {
  x: number;
  y: number;
}

export function ContextMenu() {
  const { classes } = style();
  const transitionDuration = 50;
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opened, setOpened] = useState(false);
  const [menuState] = useRecoilState(contextMenuState);
  const fileSelection = useRecoilValue(fileSelectionState);

  const findItemHeight = useCallback((item: MenuItem | MenuLabel | MenuDivider): number => {
    if ((item as MenuDivider).divider) {
      return 10;
    }

    if ((item as MenuLabel).isLabel) {
      return 30;
    }

    return 40;
  }, []);

  const handler = useCallback(({ detail: { event, type: state } }) => {
    console.log(event);
    const e = event as MouseEvent;
    e.preventDefault();
    e.stopPropagation();

    const menuHeight = state.map(findItemHeight).reduce((previous, current) => previous + current, 0);
    const overflowYBuffer = 100;
    const totalYBuffer = menuHeight + overflowYBuffer;

    setOpened(false);
    let y: number;

    if (e.clientY <= totalYBuffer && e.clientY + totalYBuffer > window.innerHeight) {
      y = window.innerHeight - totalYBuffer - 30;
    } else {
      y = e.clientY - 16;
    }

    setPosition({ x: e.clientX + 4, y });
    setOpened(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpened(false);
  }, []);

  useEffect(() => {
    // @ts-expect-error
    document.addEventListener("app-context-menu", handler);

    return () => {
      // @ts-expect-error
      document.removeEventListener("app-context-menu", handler);
    };
  }, []);

  const isMenuDivider = useCallback((menu: MenuLabel | MenuItem | MenuDivider): menu is MenuDivider => {
    return (menu as MenuDivider).divider === true;
  }, []);

  const buildMenu = useCallback(
    (menu: MenuLabel | MenuItem | MenuDivider, index: number) => {
      if (isMenuDivider(menu)) {
        return <Divider key={index} />;
      }

      if (menu.isLabel) {
        return <Menu.Label key={index}>{menu.label}</Menu.Label>;
      }

      menu = menu as MenuItem;

      if (menu.content === null) {
        return (
          <Menu.Item
            disabled={menu.disabled}
            key={index}
            onClick={() => {
              (menu as MenuItem).onTrigger();
              setOpened(false);
            }}
            icon={menu.icon}
            rightSection={menu.rightSection}
          >
            {menu.label}
          </Menu.Item>
        );
      }

      return (
        <Menu
          key={index}
          trigger="hover"
          position="right"
          delay={50}
          sx={{ width: "100%" }}
          control={
            <Menu.Item icon={menu.icon} rightSection={menu.rightSection}>
              {menu.label}
            </Menu.Item>
          }
        >
          {menu.content.map(buildMenu)}
        </Menu>
      );
    },
    [fileSelection]
  );

  return (
    <>
      {opened && <Overlay onClick={handleClose} opacity={0} color="#000" zIndex={299} />}
      <div style={{ left: position.x, top: position.y }} className={classes.wrapper}>
        <Menu size={280} transitionDuration={transitionDuration} opened={opened} control={<span />}>
          {menuState.map(buildMenu)}
        </Menu>
      </div>
    </>
  );
}
