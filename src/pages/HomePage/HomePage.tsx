import { ContextMenu } from "@components/ContextMenu";
import { ViewManager } from "@components/Views";
import { useElementSize } from "@mantine/hooks";
import { style } from "./style";

export function HomePage() {
  const { classes } = style();
  const { ref, width, height } = useElementSize();

  return (
    <div ref={ref} className={classes.wrapper}>
      <ContextMenu />
      <ViewManager width={width} height={height} />
    </div>
  );
}
