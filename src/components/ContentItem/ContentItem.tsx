import { Text, Box, MantineColor, DefaultProps, NotificationStylesNames } from "@mantine/core";
import { style } from "./style";

export interface ContentItemProps
  extends DefaultProps<NotificationStylesNames>,
    Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
  color?: MantineColor;
}

export function ContentItem({ title, description, children, color, ...others }: ContentItemProps) {
  const { classes } = style({ color: color || "blue" });
  return (
    <Box {...others} className={classes.root} role="alert">
      <div className={classes.body}>
        {title && (
          <Text className={classes.title} size="sm" weight={500}>
            {title}
          </Text>
        )}

        <Text color="dimmed" className={classes.description} size="sm">
          {description}
        </Text>
      </div>

      {children && children}
    </Box>
  );
}
