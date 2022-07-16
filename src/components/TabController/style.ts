import { createStyles } from "@mantine/core";

export const style = createStyles(() => ({
  icon: {
    height: 20,
    marginBottom: "0 !important",
    maxWidth: "26px !important",
  },
  appRegion: {
    height: 40,
    flex: 1,
    minWidth: 20,
    WebkitAppRegion: "drag",
  },
  span: {
    display: "flex",
    alignItems: "center",
  },
}));
