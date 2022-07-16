import { TransitionWrapper } from "@components/TransitionWrapper";
import { Group, Text, Timeline, Title } from "@mantine/core";
import { GitBranch, GitCommit, GitPullRequest, MessageDots } from "tabler-icons-react";
import { style } from "./style";

export function ExtensiveDetails() {
  return (
    <TransitionWrapper transition="fade">
      {(styles) => (
        <Group style={styles} p="sm">
          <Title sx={{ margin: "0 !important" }} order={4}>
            Git status of the directory
          </Title>
          <DetailContent />
        </Group>
      )}
    </TransitionWrapper>
  );
}

export function DetailContent() {
  return (
    <Timeline active={1} bulletSize={24} lineWidth={2}>
      <Timeline.Item bullet={<GitBranch size={12} />} title="New branch">
        <Text color="dimmed" size="xs">
          You&apos;ve created new branch{" "}
          <Text variant="link" component="span" inherit>
            fix-notifications
          </Text>
          from master
        </Text>
        <Text size="xs" mt={4}>
          2 hours ago
        </Text>
      </Timeline.Item>

      <Timeline.Item bullet={<GitCommit size={12} />} title="Commits">
        <Text color="dimmed" size="xs">
          You&apos;ve pushed 23 commits to
          <Text variant="link" component="span" inherit>
            fix-notifications branch
          </Text>
        </Text>
        <Text size="xs" mt={4}>
          52 minutes ago
        </Text>
      </Timeline.Item>

      <Timeline.Item
        title="Pull request"
        bullet={<GitPullRequest size={12} />}
        lineVariant="dashed"
      >
        <Text color="dimmed" size="xs">
          You&apos;ve submitted a pull request
          <Text variant="link" component="span" inherit>
            Fix incorrect notification message (#187)
          </Text>
        </Text>
        <Text size="xs" mt={4}>
          34 minutes ago
        </Text>
      </Timeline.Item>

      <Timeline.Item title="Code review" bullet={<MessageDots size={12} />}>
        <Text color="dimmed" size="xs">
          <Text variant="link" component="span" inherit>
            Robert Gluesticker
          </Text>{" "}
          left a code review on your pull request
        </Text>
        <Text size="xs" mt={4}>
          12 minutes ago
        </Text>
      </Timeline.Item>
    </Timeline>
  );
}
