import { HotkeyItem, useHotkeys } from "@mantine/hooks";
import { useCallback } from "react";
import { useEffect } from "react";

export interface ContextMenuGuardProps {
  children: React.ReactElement;
}

export function ContextGuard(props: ContextMenuGuardProps) {
  // const predicate = import.meta.env.MODE !== "development";
  let hotkeys: HotkeyItem[] = [];

  useHotkeys(hotkeys);

  const handler = useCallback((event: MouseEvent) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    document.addEventListener("contextmenu", handler);

    return () => {
      document.removeEventListener("contextmenu", handler);
    };
  });

  return props.children;
}
