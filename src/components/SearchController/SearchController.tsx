import { Group, Text, UnstyledButton } from "@mantine/core";
import { useSpotlight } from "@mantine/spotlight";
import { Search } from "tabler-icons-react";

export function SearchController(props: React.ComponentPropsWithoutRef<"button">) {
  const spotlight = useSpotlight();

  return (
    <UnstyledButton
      {...props}
      pl="sm"
      pr={5}
      onClick={spotlight.openSpotlight}
      sx={(theme) => ({
        height: "30px",
        minHeight: "30px",
        lineHeight: "30",
        fontSize: "14px",
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[5],
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],

        [theme.fn.smallerThan("sm")]: {
          display: "none",
        },
      })}
    >
      <Group spacing="xs">
        <Search size={14} />
        <Text size="sm" color="dimmed" pr={80}>
          Search
        </Text>
        <Text
          weight={700}
          sx={(theme) => ({
            fontSize: 11,
            lineHeight: 1,
            padding: "4px 7px",
            borderRadius: theme.radius.sm,
            color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
            border: `1px solid ${
              theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2]
            }`,
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
          })}
        >
          Ctrl + K
        </Text>
      </Group>
    </UnstyledButton>
  );
}
