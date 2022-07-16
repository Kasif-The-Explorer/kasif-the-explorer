import { createStyles } from "@mantine/core";

export const style = createStyles((theme) => ({
  wrapper: {
    borderBottom: "1px solid",
    borderBottomColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
    height: 40,
    justifyContent: "space-between",
  },
}));
