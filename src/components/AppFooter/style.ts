import { createStyles } from "@mantine/core";

export const style = createStyles((theme) => ({
  "actions-wrapper": {
    display: "flex",
    gap: theme.spacing.lg,
    alignItems: "center",
    height: "calc(var(--mantine-footer-height) - 1px)"
  },
  "ongoing-action": {
    display: "flex",
    gap: theme.spacing.xs,
    alignItems: "center",
    height: "100%"
  },
}));
