import { Button, Center, Loader, ScrollArea, Stack, ThemeIcon, Title } from "@mantine/core";
import { viewSettingsStoreState, ViewType } from "@store/settingsStore";
import { selectedViewState, ViewContent, viewStoreState } from "@store/viewStore";
import { useSendMessage } from "@hooks/useSendMessage";
import React from "react";
import { useRecoilValue } from "recoil";
import { AlertCircle, Refresh } from "tabler-icons-react";
import { BaseView } from "../BaseView";
import { BasicListView } from "../BasicListView";
import { DetailsView } from "../DetailsView";
import { IconsView } from "../IconsView";
import { style } from "./style";

export function ViewManager({ width, height }: { width: number; height: number }) {
  const { classes } = style();
  const [, response] = useSendMessage<ViewContent[]>();
  const viewStore = useRecoilValue(viewStoreState);
  const selectedView = useRecoilValue(selectedViewState);
  const viewSettings = useRecoilValue(viewSettingsStoreState);

  const viewMap: Record<ViewType, JSX.Element> = {
    details: <DetailsView width={width} height={height} />,
    basic: <BasicListView />,
    icons: <IconsView />,
  };

  if (response.loading) {
    return (
      <div className={classes.wrapper}>
        <Center sx={{ height: height }}>
          <Loader />
        </Center>
      </div>
    );
  }

  if (response.error) {
    return (
      <div className={classes.wrapper}>
        <Center sx={{ height: height }}>
          <Stack sx={(theme) => ({ alignItems: "center", gap: theme.spacing.lg })}>
            <ThemeIcon variant="light" color="red" size={64}>
              <AlertCircle />
            </ThemeIcon>
            <Title
              sx={(theme) => ({ color: theme.colors.gray[5], margin: "0 !important" })}
              order={3}
            >
              {response.response}
            </Title>
            <Button leftIcon={<Refresh size={14} />} variant="subtle">
              Refresh
            </Button>
          </Stack>
        </Center>
      </div>
    );
  }

  if (selectedView.type === "meta") {
    const view = viewStore.find((view) => view.id === selectedView.id);
    return <ScrollArea style={{ height: height }}>{view?.defaultPage}</ScrollArea>;
  }

  return viewMap[viewSettings.selectedViewType];
}
