import { ContentItem } from "@components/ContentItem";
import { TransitionWrapper } from "@components/TransitionWrapper";
import { Title, Stack, Group, Switch, Button, ActionIcon, Tooltip } from "@mantine/core";
import { createFallDown } from "@util/misc";
import { TrashX, Dots } from "tabler-icons-react";

export interface BackgroundTaskItem {
  color: string;
  title: string;
  description: string;
  action: React.ReactNode;
}

export function BackgroundTasksPage() {
  const backgroundTasks: BackgroundTaskItem[] = [
    {
      color: "green",
      title: "Sample Action",
      description: "Sample action that is ongoing.",
      action: (
        <Group sx={theme => ({ gap: theme.spacing.xs })}>
          <Tooltip label="Terminate">
          <ActionIcon size="lg" color="red" variant="light">
            <TrashX />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="About this task">
          <ActionIcon size="lg" variant="light">
            <Dots />
          </ActionIcon>
        </Tooltip>
        </Group>
      ),
    },
  ];

  return (
    <Stack p="xs">
      <Title
        sx={(theme) => ({
          marginTop: `${theme.spacing.xs}px !important`,
          marginBottom: "0 !important",
        })}
        order={2}
      >
        Background Tasks
      </Title>
      <Stack sx={(theme) => ({ gap: theme.spacing.xs })}>
        {backgroundTasks.map((item, i) => (
          <TransitionWrapper
            key={i}
            transition={createFallDown(i, backgroundTasks.length)}
            duration={300}
          >
            {(styles) => (
              <ContentItem
                color={item.color}
                style={styles}
                title={item.title}
                description={item.description}
              >
                {item.action}
              </ContentItem>
            )}
          </TransitionWrapper>
        ))}
      </Stack>
    </Stack>
  );
}
