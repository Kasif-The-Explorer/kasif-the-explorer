import { ActionController } from "@components/ActionController";
import { TabController } from "@components/TabController";
import {
  CSSObject,
  Group,
  Header,
  MantineTheme,
  Popover,
  Text,
  Image,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { appWindow } from "@tauri-apps/api/window";
import icon from "@img/favicon.png";
import { useState, useCallback, useMemo } from "react";
import { setPersistentData } from "@/persistentData";
import { appDir } from '@tauri-apps/api/path';

export function AppHeader() {
  const theme = useMantineTheme();
  const [popoverOpened, setPopoverOpened] = useState(false);

  const windowActionSx: CSSObject = useMemo(
    () => ({
      height: "100%",
      width: 54,
      backgroundColor: "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "default",
      userSelect: "none",
    }),
    []
  );

  const basicActionSx = useCallback(
    (theme: MantineTheme) => ({
      ...windowActionSx,
      "&:hover": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.gray[9] : theme.colors.gray[1],
      },
      "&:active": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.gray[8] : theme.colors.gray[2],
      },
    }),
    [windowActionSx]
  );

  const closeActionSx = useCallback(
    (theme: MantineTheme) => ({
      ...windowActionSx,
      "&:hover": {
        backgroundColor: theme.colors.red[6],
        color: theme.white,
      },
      "&:active": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.red[7] : theme.colors.red[5],
      },
    }),
    [windowActionSx]
  );

  return (
    <div>
      <Header
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        }}
        height={90}
      >
        <Group
          sx={(theme) => ({
            height: "100%",
            display: "flex",
            borderBottom: "1px solid",
            gap: theme.spacing.xs,
            borderBottomColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
          })}
          px={10}
          position="apart"
        >
          <Popover
            opened={popoverOpened}
            onClose={() => setPopoverOpened(false)}
            position="bottom"
            target={
              <Image
                onClick={() => setPopoverOpened((o) => !o)}
                height={24}
                sx={{
                  "& img": {
                    marginBottom: "0 !important",
                  },
                }}
                src={icon}
                alt="icon"
              />
            }
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Image src={icon} width={30} height={30} sx={{ minWidth: 30 }} mr="md" />
              <Text color="dimmed" size="sm">
                Kâşif the Explorer v0.1.0
              </Text>
            </div>
          </Popover>
          <TabController />
          <Group mr={-10} sx={{ gap: 0, height: "100%" }}>
            <UnstyledButton onClick={() => appWindow.minimize()} ml={1} sx={basicActionSx}>
              &#x2500;
            </UnstyledButton>
            <UnstyledButton onClick={() => appWindow.toggleMaximize()} ml={1} sx={basicActionSx}>
              &#x25FB;
            </UnstyledButton>
            <UnstyledButton onClick={async () => {
              // await setPersistentData("localStorage", "hello")
              // const appDirPath = await appDir();
              // console.log("closing", appDirPath);
              appWindow.close()
            }} ml={1} sx={closeActionSx}>
              &#x2715;
            </UnstyledButton>
          </Group>
        </Group>
        <ActionController />
      </Header>
    </div>
  );
}
