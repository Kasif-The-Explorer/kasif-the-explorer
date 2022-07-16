import { MantineTheme, useMantineTheme } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Dimension, Rect, Vector2D } from "./vector";

export interface RenderOptions {
  context: CanvasRenderingContext2D;
  root: HTMLElement;
  onAreaUpdate: (area: Rect, ctrlKey: boolean, shiftKey: boolean) => void;
  dragToggle: (value: boolean) => void;
  theme: MantineTheme;
}

function render({ context, root, onAreaUpdate, dragToggle, theme }: RenderOptions): () => void {
  const { width, height } = context.canvas;
  const rect = root.getBoundingClientRect();
  let area: Rect | null = null;
  let animation = 0;

  // State
  let dragging = false;
  let start = new Vector2D(0, 0);
  let end = new Vector2D(0, 0);

  // Event Handlers
  const handleMouseDown = (event: MouseEvent) => {
    if (event.button === 0 || event.button === 2) {
      // @ts-expect-error
      const path: EventTarget[] = event.path || (event.composedPath && event.composedPath());

      let inside =
        path.filter((element: EventTarget) => (element as HTMLElement).classList?.contains("view-scroll-area")).length >
        0;

      let draggable = path
        .filter((element) => element instanceof HTMLElement)
        .map(
          (element: EventTarget) =>
            (element as HTMLElement).classList.contains("non-drag-target") ||
            (element as HTMLElement).classList.contains("mantine-ScrollArea-scrollbar")
        )
        .includes(true);

      if (inside && !draggable) {
        start.set([event.clientX - rect.left, event.clientY - rect.top]);
        end.set([event.clientX - rect.left, event.clientY - rect.top]);
        dragging = true;
        dragToggle(true);
      }
    }
  };
  document.addEventListener("mousedown", handleMouseDown);

  const handleMouseMove = (event: MouseEvent) => {
    end.add(event);
  };
  document.addEventListener("mousemove", handleMouseMove);

  const handleMouseUp = (event: MouseEvent) => {
    const scrollWrapper =
      document.querySelector(".view-scroll-area .mantine-ScrollArea-viewport") ||
      document.querySelector(".view-scroll-area")!;

    if (dragging) {
      dragging = false;
      dragToggle(false);

      area = start.getRect(end);
      area.y += scrollWrapper.scrollTop || 0;
      start.set([0, 0]);
      end.set([0, 0]);
      onAreaUpdate(area, event.ctrlKey, event.shiftKey);
    }
  };
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("mouseleave", handleMouseUp);

  // Draw
  const _draw = () => {
    if (dragging) {
      context.save();
      let rect = start.getRect(end);
      context.fillStyle = theme.fn.rgba(theme.colors.blue[5], 0.3);
      context.fillRect(rect.x, rect.y, rect.width, rect.height);
      context.strokeStyle = theme.fn.rgba(theme.colors.blue[5], 0.8);
      context.lineWidth = 0.4;
      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      context.restore();
    }
  };

  const animate = () => {
    context.clearRect(0, 0, width, height);
    _draw();
    animation = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    document.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mouseleave", handleMouseUp);
    cancelAnimationFrame(animation);
  };
}

export interface SelectorCanvasProps extends Dimension {
  onAreaUpdate: (area: Rect, ctrlKey: boolean, shiftKey: boolean) => void;
}

export function SelectorCanvas({ width, height, onAreaUpdate }: SelectorCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  let context: CanvasRenderingContext2D | null = null;
  const theme = useMantineTheme();
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let unmount = () => {};
    if (ref.current) {
      const _context = ref.current.getContext("2d")!;
      context = _context;

      ref.current.width = width;
      ref.current.height = height;
      unmount = render({
        context,
        root: ref.current,
        onAreaUpdate,
        dragToggle: setDragging,
        theme: theme,
      });
    }

    return unmount;
  }, [width, height, theme]);

  return <canvas style={{ position: "fixed", zIndex: dragging ? 200 : -1 }} ref={ref} />;
}
