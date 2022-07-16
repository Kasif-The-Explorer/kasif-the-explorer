import { createStyles, MantineColor } from "@mantine/core";

export interface NotificationStylesParams {
  color: MantineColor;
}

export const style = createStyles((theme, { color }: NotificationStylesParams) => {
  const _radius = 4;
  const topBottom = 4;

  return {
    closeButton: {},

    withIcon: {
      paddingLeft: theme.spacing.xs,

      "&::before": {
        display: "none",
      },
    },

    root: {
      boxSizing: "border-box",
      position: "relative",
      display: "flex",
      alignItems: "center",
      paddingLeft: 22,
      paddingRight: 5,
      paddingTop: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
      borderRadius: _radius,
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      border: `1px solid ${
        theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2]
      }`,

      "&:hover": {
        boxShadow: theme.shadows.lg,
      },

      "&::before": {
        content: "''",
        display: "block",
        position: "absolute",
        width: 6,
        top: topBottom,
        bottom: topBottom,
        left: 4,
        borderRadius: _radius,
        backgroundColor: theme.colors[color][7],
      },
    },

    body: {
      flex: 1,
      overflow: "hidden",
      marginRight: 10,
    },

    loader: {
      marginRight: theme.spacing.md,
    },

    title: {
      lineHeight: 1.4,
      marginBottom: 2,
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: theme.colorScheme === "dark" ? theme.white : theme.colors.gray[9],
    },

    description: {
      color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
      lineHeight: 1.4,
      overflow: "hidden",
      textOverflow: "ellipsis",

      "&:only-child": {
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      },
    },
  };
});
