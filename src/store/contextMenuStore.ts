import { CustomKbd } from "@components/ContextMenu";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import {
  ChevronRight,
  List,
  Affiliate,
  LayoutList,
  Refresh,
  Pin,
  Search,
  Settings,
  Check,
  Trash,
  CursorText,
  Cut,
  Copy,
  ExternalLink,
  Apps,
  Clipboard,
  ArrowBack,
  NewSection,
} from "tabler-icons-react";
import { fileSelectionState } from "./fileSelectionStore";
import { useOpenViewContent } from "./viewStore";

export type MenuState = Array<MenuItem | MenuLabel | MenuDivider>;

export interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  rightSection?: React.ReactNode;
  children?: MenuState;
  isLabel: false;
  content: MenuState | null;
  disabled?: boolean;
  onTrigger: Function;
}

export interface MenuLabel {
  label: string;
  isLabel: true;
}

export interface MenuDivider {
  divider: true;
}

export function useMenuStates() {
  const openViewContent = useOpenViewContent();
  const fileSelection = useRecoilValue(fileSelectionState);

  const handleOpenViewContent = useCallback(() => {
    if (fileSelection.length > 0) {
      openViewContent(fileSelection.at(-1)!);
    }
  }, [fileSelection]);

  const fileItemMenuState: MenuState = [
    { label: "File", isLabel: true },
    {
      label: "Open",
      isLabel: false,
      content: null,
      icon: React.createElement(ExternalLink, { size: 14 }),
      onTrigger: handleOpenViewContent,
    },
    {
      label: "Open With",
      isLabel: false,
      content: null,
      icon: React.createElement(Apps, { size: 14 }),
      onTrigger: () => {},
    },
    {
      label: "Cut",
      isLabel: false,
      content: null,
      icon: React.createElement(Cut, { size: 14 }),
      rightSection: React.createElement(CustomKbd, null, ["Ctrl+X"]),
      onTrigger: () => {},
    },
    {
      label: "Copy",
      isLabel: false,
      content: null,
      icon: React.createElement(Copy, { size: 14 }),
      rightSection: React.createElement(CustomKbd, null, ["Ctrl+C"]),
      onTrigger: () => {},
    },
    {
      label: "Create Shortcut",
      isLabel: false,
      content: null,
      icon: React.createElement(Affiliate, { size: 14 }),
      onTrigger: () => {},
    },
    {
      label: "Rename",
      isLabel: false,
      content: null,
      icon: React.createElement(CursorText, { size: 14 }),
      rightSection: React.createElement(CustomKbd, null, ["F2"]),
      onTrigger: () => {},
    },
    {
      label: "Delete",
      isLabel: false,
      content: null,
      icon: React.createElement(Trash, { size: 14 }),
      rightSection: React.createElement(CustomKbd, null, ["Del"]),
      onTrigger: () => {},
    },
    { divider: true },
    {
      label: "Properties",
      isLabel: false,
      content: null,
      icon: React.createElement(Settings, { size: 14 }),
      onTrigger: () => {},
    },
  ];

  const folderItemMenuState: MenuState = [
    { label: "File", isLabel: true },
    {
      label: "Open",
      isLabel: false,
      content: null,
      icon: React.createElement(ExternalLink, { size: 14 }),
      onTrigger: handleOpenViewContent,
    },
    {
      label: "Cut",
      isLabel: false,
      content: null,
      icon: React.createElement(Cut, { size: 14 }),
      rightSection: React.createElement(CustomKbd, null, ["Ctrl+X"]),
      onTrigger: () => {},
    },
    {
      label: "Copy",
      isLabel: false,
      content: null,
      icon: React.createElement(Copy, { size: 14 }),
      rightSection: React.createElement(CustomKbd, null, ["Ctrl+C"]),
      onTrigger: () => {},
    },
    {
      label: "Create Shortcut",
      isLabel: false,
      content: null,
      icon: React.createElement(Affiliate, { size: 14 }),
      onTrigger: () => {},
    },
    {
      label: "Rename",
      isLabel: false,
      content: null,
      icon: React.createElement(CursorText, { size: 14 }),
      rightSection: React.createElement(CustomKbd, null, ["F2"]),
      onTrigger: () => {},
    },
    {
      label: "Delete",
      isLabel: false,
      content: null,
      icon: React.createElement(Trash, { size: 14 }),
      rightSection: React.createElement(CustomKbd, null, ["Del"]),
      onTrigger: () => {},
    },
    { divider: true },
    {
      label: "Properties",
      isLabel: false,
      content: null,
      icon: React.createElement(Settings, { size: 14 }),
      onTrigger: () => {},
    },
  ];

  const folderViewMenuState: MenuState = [
    { label: "Folder", isLabel: true },
    {
      label: "Order by",
      isLabel: false,
      rightSection: React.createElement(ChevronRight, { size: 16 }),
      onTrigger: () => {},
      icon: React.createElement(List, { size: 14 }),
      content: [
        {
          label: "Name",
          isLabel: false,
          rightSection: React.createElement(Check, { size: 16 }),
          content: null,
          onTrigger: () => {},
        },
        {
          label: "Modification Date",
          isLabel: false,
          content: null,
          onTrigger: () => {},
        },
        {
          label: "Type",
          isLabel: false,
          content: null,
          onTrigger: () => {},
        },
        {
          label: "Size",
          isLabel: false,
          content: null,
          onTrigger: () => {},
        },
        { divider: true },
        {
          label: "Ascending",
          isLabel: false,
          rightSection: React.createElement(Check, { size: 16 }),
          content: null,
          onTrigger: () => {},
        },
        {
          label: "Descending",
          isLabel: false,
          content: null,
          onTrigger: () => {},
        },
      ],
    },
    {
      label: "Refresh",
      isLabel: false,
      rightSection: React.createElement(CustomKbd, null, ["Ctrl+R"]),
      icon: React.createElement(Refresh, { size: 14 }),
      onTrigger: () => {},
      content: null,
    },
    {
      label: "Search",
      isLabel: false,
      rightSection: React.createElement(CustomKbd, null, ["Ctrl+K"]),
      icon: React.createElement(Search, { size: 14 }),
      onTrigger: () => {},
      content: null,
    },
    {
      label: "Pin to board",
      isLabel: false,
      rightSection: React.createElement(CustomKbd, null, ["Ctrl+P"]),
      icon: React.createElement(Pin, { size: 14 }),
      onTrigger: () => {},
      content: null,
    },
    { divider: true },
    { label: "Action", isLabel: true },
    {
      label: "Paste",
      isLabel: false,
      icon: React.createElement(Clipboard, { size: 14 }),
      rightSection: React.createElement(CustomKbd, null, ["Ctrl+V"]),
      onTrigger: () => {},
      disabled: true,
      content: null,
    },
    {
      label: "Undo",
      isLabel: false,
      icon: React.createElement(ArrowBack, { size: 14 }),
      rightSection: React.createElement(CustomKbd, null, ["Ctrl+Z"]),
      onTrigger: () => {},
      content: null,
    },
    {
      label: "New",
      isLabel: false,
      icon: React.createElement(NewSection, { size: 14 }),
      rightSection: React.createElement(ChevronRight, { size: 16 }),
      onTrigger: () => {},
      content: null,
    },
    { divider: true },
    {
      label: "Properties",
      isLabel: false,
      icon: React.createElement(Settings, { size: 14 }),
      onTrigger: () => {},
      content: null,
    },
  ];

  return { fileItemMenuState, folderItemMenuState, folderViewMenuState };
}

export const defaultMenuState: MenuState = [];

export const contextMenuState = atom<MenuState>({
  key: "ContextMenuState",
  default: defaultMenuState,
});

export interface ContextMenuHookOptions {
  type: MenuState;
}

export function useContextMenu<T extends HTMLElement>(
  options: ContextMenuHookOptions,
  callbackfn: (event: MouseEvent) => void
): React.RefObject<T> {
  const ref = useRef<T>(null);
  const [, setMenuState] = useRecoilState(contextMenuState);

  const handler = useCallback((e: MouseEvent) => {
    document.dispatchEvent(new CustomEvent("app-context-menu", { detail: { event: e, type: options.type } }));
    callbackfn(e);
    setMenuState(options.type);
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("contextmenu", handler);

      return () => {
        if (ref.current) {
          ref.current.removeEventListener("contextmenu", handler);
        }
      };
    }
  }, [ref.current]);

  return ref;
}
