import { createStyles } from "@mantine/core";

export const style = createStyles(
  (theme, { isSelected, height }: { isSelected: boolean; height: number }) => {
    const getBackgroundColor = (isSelected: boolean): string => {
      if (isSelected) {
        return theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2];
      } else {
        return "transparent";
      }
    };

    const getHoverColor = (isSelected: boolean): string => {
      if (isSelected) {
        return theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2];
      } else {
        return theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1];
      }
    };

    return {
      wrapper: {
        position: "relative",
        height: "100%",
      },
      stack: {
        userSelect: "none",
      },
      icon: {
        height: 18,
        marginBottom: "0 !important",
      },
      row: {
        width: "100%",
        height: "100%",
        padding: "4px 14px",
        borderRadius: theme.radius.sm,
        backgroundColor: getBackgroundColor(isSelected),
        "&:hover": { backgroundColor: getHoverColor(isSelected) },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      cellInput: {
        paddingRight: 10,
        height: height,
        "& input": {
          border: "none !important",
          fontSize: theme.fontSizes.xs,
          minHeight: height,
          height: height,
          padding: "0 6px",
        },
      },
    };
  }
);
