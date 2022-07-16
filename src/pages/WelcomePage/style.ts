import { createStyles } from "@mantine/core";

export const style = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    height: "calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))",
  },
  content: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: theme.spacing.xl,
    position: "relative",
    zIndex: 10,
  },
  background: {
    zIndex: 0,
    position: "absolute",
    left: 0,
    top: 0,
    backgroundImage: "url(/img/bg.svg)",
    width: "100%",
    backgroundSize: "111%",
    backgroundPosition: "0 94%",
    height: "calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))",
  },
}));
