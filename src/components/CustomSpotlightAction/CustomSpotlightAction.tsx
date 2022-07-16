import { UnstyledButton, Group, Center, Image, Text, Badge, ScrollArea } from "@mantine/core";
import { SpotlightActionProps } from "@mantine/spotlight";
import { style } from "./style";

export function CustomSpotlightAction({
  action,
  styles,
  classNames,
  hovered,
  onTrigger,
  ...others
}: SpotlightActionProps) {
  const { classes, cx } = style();
  const maxDescSize = 40;
  let description = action.description!;
  let excerpted = false;

  if ((action.description?.length || 0) > maxDescSize) {
    excerpted = true;
    description = description.slice(0, maxDescSize);
  }

  return (
    <UnstyledButton
      className={cx(classes.action, { [classes.actionHovered]: hovered })}
      tabIndex={-1}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onTrigger}
      {...others}
    >
      <Group noWrap>
        {action.image && (
          <Center>
            <Image src={action.image} alt={action.title} width={34} height={34} />
          </Center>
        )}

        <div className={classes.actionBody}>
          <Text size="sm">{action.title}</Text>

          {action.description && (
            <Text color="dimmed" size="xs">
              {description}
              {excerpted && "..."}
            </Text>
          )}
        </div>

        {action.type && <Badge>{action.type}</Badge>}
      </Group>
    </UnstyledButton>
  );
}

export function CustomActionsWrapper({ children }: { children: React.ReactNode }) {
  return <ScrollArea style={{ height: window.innerHeight - 240 }}>{children}</ScrollArea>;
}
