import { TransitionWrapper } from "@components/TransitionWrapper";
import { Group, Text, Title, Transition, UnstyledButton } from "@mantine/core";
import { quickSelectionState } from "@store/quickSelectionStore";
import { useAddView, View } from "@store/viewStore";
import { useTransition } from "@hooks/useTransition";
import { useRecoilValue } from "recoil";
import { style } from "./style";

export function WelcomePage() {
  const { classes } = style();
  const quickSelection = useRecoilValue(quickSelectionState);

  return (
    <div className={classes.wrapper}>
      <div className={classes.background} />
      <div className={classes.content}>
        <TransitionWrapper duration={200} transition="fade">
          {(styles) => (
            <Title
              style={styles}
              sx={(theme) => ({
                color: `${theme.colors.blue[9]} !important`,
                margin: "0 !important",
              })}
              order={1}
            >
              Welcome Traveller
            </Title>
          )}
        </TransitionWrapper>
        <TransitionWrapper duration={600} transition="slide-down">
          {(styles) => (
            <Group style={{ ...styles }} sx={(theme) => ({ gap: theme.spacing.xs })}>
              {quickSelection.main.map((item) => (
                <CustomQuickSelectionItem key={item.id} view={item} />
              ))}
            </Group>
          )}
        </TransitionWrapper>
        <TransitionWrapper duration={200} transition="fade">
          {(styles) => (
            <Text size="xs" color="dimmed" style={styles}>
              Vectors by Vecteezy
            </Text>
          )}
        </TransitionWrapper>
      </div>
    </div>
  );
}

export function CustomQuickSelectionItem({ view }: { view: View }) {
  const add = useAddView();

  return (
    <UnstyledButton
      onClick={() => add(view)}
      sx={(theme) => ({
        width: 90,
        height: 90,
        background: theme.fn.rgba(
          theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
          0.7
        ),
        borderRadius: theme.radius.md,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 100ms, backgroundColor 100ms",

        "&:hover": {
          background: theme.fn.rgba(
            theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
            0.8
          ),
          transform: "translateY(-6px)",
        },
      })}
    >
      {view.type === "meta" ? view.icon : <img height={32} src={view.icon as string} />}
      <Text size="sm">{view.label}</Text>
    </UnstyledButton>
  );
}
