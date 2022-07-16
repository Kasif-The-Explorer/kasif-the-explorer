import { createStyles } from "@mantine/core";

export const style = createStyles(() => ({
  wrapper: {
    height: "calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))",
  },
}));
