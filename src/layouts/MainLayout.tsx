import { AppFooter } from "@components/AppFooter";
import { AppHeader } from "@components/AppHeader";
import { QuickSelection } from "@components/QuickSelection";
import { AppShell, Navbar, ScrollArea, Text, Transition } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { style } from "@pages/LoginPage";
import { useEffect, useState } from "react";

export function MainLayout({ ready }: { ready: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [spalshDone, setSpalshDone] = useState(false);
  const { classes, cx } = style();

  useEffect(() => {
    if (ready) {
      setLoaded(true);
      setTimeout(() => {
        setSpalshDone(true);
      }, 500);
    }
  }, [ready]);

  return (
    <>
      {loaded && (
        <AppShell
          padding="md"
          navbar={
            <Navbar width={{ base: 240, lg: 280 }} p={"0 10px"}>
              <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
                <QuickSelection />
              </Navbar.Section>
            </Navbar>
          }
          header={<AppHeader />}
          footer={<AppFooter />}
          styles={(theme) => ({
            main: {
              display: "flex",
              flexDirection: "column",
              padding: 0,
              backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
            },
          })}
        >
          <Outlet />
        </AppShell>
      )}
      <Transition mounted={!spalshDone} transition="fade" duration={200} timingFunction="ease">
        {(styles) => (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              ...styles,
            }}
            className={cx(classes.hero, classes.splash)}
          >
            <Text className={classes.attribution} size="sm">
              Vectors by Vecteezy
            </Text>
          </div>
        )}
      </Transition>
    </>
  );
}
