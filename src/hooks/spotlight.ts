import { SpotlightAction } from "@mantine/spotlight";
import path from "path-browserify";
import { getContentScrollY } from "@util/misc";
import { findIconForContent } from "../util/misc";
import {
  ContentType,
  createViewFromPath,
  selectedViewState,
  useOpenViewContent,
  ViewContent,
} from "@store/viewStore";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";

export interface RawSearchItem {
  path: string;
  type: ContentType;
}

function generateActionFromItem(item: RawSearchItem): SpotlightAction {
  const parsed = path.parse(item.path);
  const title = parsed.name + parsed.ext;

  return {
    title: title,
    description: item.path,
    image: findIconForContent(item.type, title),
    type: item.type,
    onTrigger: () => {},
  };
}

export function useSpotlightActions(): SpotlightAction[] {
  const selectedView = useRecoilValue(selectedViewState);
  const [actions, setActions] = useState<SpotlightAction[]>([]);
  const open = useOpenViewContent();

  useEffect(() => {
    const newActions = selectedView.content.map((item) => ({
      ...generateActionFromItem(item),
      onTrigger: () => {
        createViewFromPath(item.path).then((view) => {
          open(view as Pick<ViewContent, "path" | "label" | "type">);
        });
      },
    }));
    setActions(newActions);
  }, [selectedView]);

  return actions;
}
