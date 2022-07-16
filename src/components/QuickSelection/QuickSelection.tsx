import { Center, Divider, Group, Space, Sx, Text, ThemeIcon, Transition, UnstyledButton } from "@mantine/core";
import { style } from "./style";

import { Repeat, Pinned, Dashboard } from "tabler-icons-react";
import { useRecoilState, useRecoilValue } from "recoil";
import { quickSelectionState } from "@store/quickSelectionStore";
import { appSettingsStoreState } from "@store/settingsStore";
import { useTransition } from "@hooks/useTransition";
import { createSlideIn } from "@util/misc";
import { useAddView, View } from "@store/viewStore";
import { useCallback, useMemo } from "react";

function CustomDividerLabel(props: { label: string; icon: JSX.Element; color: string }) {
  return (
    <Center>
      <ThemeIcon variant="light" color={props.color} size="xs">
        {props.icon}
      </ThemeIcon>
      <Space w="xs" />
      <Text size="xs">{props.label}</Text>
    </Center>
  );
}

export function QuickSelection() {
  const [{ main, pinned, recent }] = useRecoilState(quickSelectionState);

  return (
    <div>
      <CustomDivider index={1} max={3} label="Main" icon={<Dashboard size={12} />} list={main} />
      <CustomDivider index={2} max={3} label="Pinned" icon={<Pinned size={12} />} list={pinned} />
      <CustomDivider index={3} max={3} label="Recent" icon={<Repeat size={12} />} list={recent} />
    </div>
  );
}

function CustomDivider(props: { list: View[]; index: number; max: number; label: string; icon: JSX.Element }) {
  const { quickSelectionSize } = useRecoilValue(appSettingsStoreState);
  const mounted = useTransition();
  const dividerSx = useMemo(() => ({ "& div::after": { visibility: "hidden" } } as Sx), []);

  const map = useCallback(
    (links: View[]): JSX.Element | JSX.Element[] => {
      if (links.length > 0) {
        return links.map((link, i) => <Selection size={quickSelectionSize} {...link} key={link.path} />);
      }

      return (
        <Center my="md">
          <Text color="gray" size="xs">
            Nothing here
          </Text>
        </Center>
      );
    },
    [quickSelectionSize]
  );

  return (
    <Transition
      mounted={mounted}
      transition={createSlideIn(props.index, props.max)}
      duration={300}
      timingFunction="ease-in-out"
    >
      {(styles) => (
        <div style={styles}>
          <Divider
            sx={dividerSx}
            my="xs"
            label={<CustomDividerLabel color="blue" label={props.label} icon={props.icon} />}
          />
          {map(props.list)}
        </div>
      )}
    </Transition>
  );
}

interface SelectionProps extends View {
  size: number;
}

function Selection(props: SelectionProps) {
  const { icon, label, size, type } = props;
  const add = useAddView();
  const { classes } = style();

  return (
    <UnstyledButton
      onClick={() => add(props)}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: size,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        "&:hover": {
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group sx={(theme) => ({ gap: theme.spacing.xs, flexWrap: "nowrap" })}>
        {type === "meta" ? icon : <img className={classes.icon} src={icon as string} />}
        <Text sx={{ whiteSpace: "nowrap" }} size="xs">
          {label}
        </Text>
      </Group>
    </UnstyledButton>
  );
}
