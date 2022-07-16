import { Text, Footer, Loader, Group, ActionIcon, Tooltip, Transition } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { BackgroundTasksPage } from "@pages/BackgroundTasksPage";
import { LicensesPage } from "@pages/LicensesPage";
import { SettingsPage } from "@pages/SettingsPage";
import { fileSelectionState } from "@store/fileSelectionStore";
import { taskStoreState } from "@store/taskStore";
import { selectedViewState, useAddView, viewStoreState } from "@store/viewStore";
import { useTransition } from "@hooks/useTransition";
import { useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { Settings, Subtask, License } from "tabler-icons-react";
import { style } from "./style";

export function AppFooter() {
  const { classes } = style();
  const add = useAddView();
  const mounted = useTransition();
  const selectedView = useRecoilValue(selectedViewState);
  const fileSelection = useRecoilValue(fileSelectionState);
  const taskStore = useRecoilValue(taskStoreState);
  const viewStore = useRecoilValue(viewStoreState);

  const handleOpenTasks = useCallback(() => {
    add({
      type: "meta",
      icon: <Subtask size={20} />,
      label: "Background Tasks",
      path: "Background Tasks",
      id: "bg-tasks",
      content: [],
      popped: [],
      history: [],
      defaultPage: <BackgroundTasksPage />,
    });
  }, [viewStore]);

  const handleOpenSettings = useCallback(() => {
    add({
      type: "meta",
      icon: <Settings size={20} />,
      label: "Settings",
      path: "Settings",
      id: "settings",
      content: [],
      popped: [],
      history: [],
      defaultPage: <SettingsPage />,
    });
  }, [viewStore]);

  const handleOpenLicenses = useCallback(() => {
    add({
      type: "meta",
      icon: <License size={20} />,
      label: "Licenses",
      path: "Licenses",
      id: "licenses",
      content: [],
      popped: [],
      history: [],
      defaultPage: <LicensesPage />,
    });
  }, [viewStore]);

  const funFacts = useMemo(
    () => [
      "It is impossible for most people to lick their own elbow. (try it!)",
      "A crocodile cannot stick its tongue out.",
      "A shrimp's heart is in its head.",
      "It is physically impossible for pigs to look up into the sky.",
      "If you sneeze too hard, you could fracture a rib.",
      "Wearing headphones for just an hour could increase the bacteria in your ear by 700 times.",
      "Some lipsticks contain fish scales.",
      "Cat urine glows under a black-light.",
      "Like fingerprints, everyone's tongue print is different.",
      "Rubber bands last longer when refrigerated.",
      "There are 293 ways to make change for a dollar.",
      "'Dreamt' is the only English word that ends in the letters 'mt'.",
      "Almonds are a member of the peach family.",
      "Maine is the only state that has a one-syllable name.",
      "Los Angeles' full name is 'El Pueblo de Nuestra Senora la Reina de los Angeles de Porciuncula'",
      "A cat has 32 muscles in each ear.",
      "An ostrich's eye is bigger than its brain.",
      "Tigers have striped skin, not just striped fur.",
      "In many advertisements, the time displayed on a watch is 10:10.",
      "A dime has 118 ridges around the edge.",
      "The giant squid has the largest eyes in the world.",
      "Most people fall asleep in seven minutes.",
      "'Stewardesses' is the longest word that is typed with only the left hand.",
    ],
    []
  );

  const getSelectionText = useCallback((): string => {
    if (selectedView) {
      if (selectedView.type === "meta") {
        return funFacts[Math.floor(Math.random() * (funFacts.length - 1 + 1))];
      }
      if (fileSelection.length > 0) {
        return `${fileSelection.length} of ${selectedView.content.length} Selected`;
      } else {
        switch (selectedView.content.length) {
          case 0:
            return `No Items`;
          case 1:
            return `1 Item`;
          default:
            return `${selectedView.content.length} Items`;
        }
      }
    } else {
      return "";
    }
  }, [selectedView, fileSelection]);

  const getTaskUI = useCallback((): JSX.Element => {
    if (taskStore.length > 0) {
      return (
        <>
          <Text color="blue" size="xs">
            {taskStore[0].label}
          </Text>
          <Loader color="blue" size={14} />
          {taskStore.length > 1 && (
            <Text size="xs">
              and {taskStore.length - 1} other task{taskStore.length - 1 === 1 ? "" : "s"}
            </Text>
          )}
        </>
      );
    } else {
      return <span />;
    }
  }, [taskStore]);

  return (
    <Transition mounted={mounted} transition="slide-up" duration={300} timingFunction="ease-in-out">
      {(styles) => (
        <Footer style={styles} height={30}>
          <Group px="sm" position="apart">
            <div className={classes["actions-wrapper"]}>
              <div className={classes["ongoing-action"]}>
                {getTaskUI()}|<Text size="xs">{getSelectionText()}</Text>
              </div>
            </div>
            <div className={classes["actions-wrapper"]}>
              <Tooltip label={<Text size="xs">Manage Background Tasks</Text>}>
                <ActionIcon onClick={handleOpenTasks} color="blue" variant="transparent" size="xs">
                  <Subtask size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={<Text size="xs">App Settings</Text>}>
                <ActionIcon
                  onClick={handleOpenSettings}
                  color="blue"
                  variant="transparent"
                  size="xs"
                >
                  <Settings size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={<Text size="xs">Licenses</Text>}>
                <ActionIcon
                  onClick={handleOpenLicenses}
                  color="blue"
                  variant="transparent"
                  size="xs"
                >
                  <License size={16} />
                </ActionIcon>
              </Tooltip>
            </div>
          </Group>
        </Footer>
      )}
    </Transition>
  );
}
