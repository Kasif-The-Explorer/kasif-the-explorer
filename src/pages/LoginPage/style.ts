import { createStyles } from "@mantine/core";

const backgrounds = [
  { color: "white", url: "url(/img/explore_1.svg)" },
  { color: "white", url: "url(/img/explore_2.svg)" },
  { color: "white", url: "url(/img/explore_3.svg)" },
  { color: "white", url: "url(/img/explore_4.svg)" },
];

const background = backgrounds[Math.floor(Math.random() * (backgrounds.length - 1 + 1))];

export const style = createStyles((theme) => {
  return {
    loginWrapper: {
      display: "flex",
      height: "100vh",
      width: "100vw",
    },
    hero: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flex: 3,
      backgroundImage: background.url,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
    },
    formWrapper: {
      padding: theme.spacing.xl,
      gap: theme.spacing.md,
      display: "flex",
      flexDirection: "column",
      flex: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    form: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing.sm,
    },
    attribution: {
      position: "fixed",
      fontSize: theme.fontSizes.xs,
      left: theme.spacing.sm,
      bottom: theme.spacing.sm,
      color: background.color,
    },
    splash: {
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 200
    }
  };
});
