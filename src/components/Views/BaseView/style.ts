import { createStyles } from "@mantine/core";

export const style = createStyles((theme) => ({
  wrapper: {
    height: "100%",
    position: "relative",
    flex: 2,
    boxSizing: "border-box",
    paddingLeft: theme.spacing.sm,
  },
  details: {
    flex: 1,
  },
}));
