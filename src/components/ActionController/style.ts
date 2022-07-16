import { createStyles } from "@mantine/core";

export const style = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    height: "calc(var(--mantine-header-height) / 1.4)",
  },
  top: {
    width: "100%",
    height: 30,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
  pathWrapper: {
    height: "100%",
    flex: 1,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
    padding: "0 10px",
    borderRadius: "4px",
  },
  pathDivider: {
    marginTop: 1,
    color: theme.colors.gray[6],
  },
  pathButton: {
    height: "100%",
    minWidth: 30,
    textAlign: "center",
    padding: "0 4px",
    borderRadius: theme.radius.xs,
    whiteSpace: "nowrap",
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor: theme.fn.rgba(theme.colors.blue[2], 0.4),
    },
    "&:active": {
      backgroundColor: theme.fn.rgba(theme.colors.blue[2], 0.5),
    },
  },
}));
