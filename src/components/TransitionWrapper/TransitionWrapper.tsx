import { Transition } from "@mantine/core";
import { appSettingsStoreState } from "@store/settingsStore";
import { useTransition } from "@hooks/useTransition";
import React from "react";
import { useRecoilValue } from "recoil";

export function TransitionWrapper({
  children,
  transition,
  duration = 200,
}: {
  children(styles?: React.CSSProperties): React.ReactElement<any, any>;
  transition: any;
  duration?: number;
}) {
  const settings = useRecoilValue(appSettingsStoreState);
  const mounted = useTransition();

  if (settings.turnOffOptinAnimations) {
    return children();
  }

  return (
    <Transition
      mounted={mounted}
      transition={transition}
      duration={duration}
      timingFunction="ease-in-out"
    >
      {(styles) => children(styles)}
    </Transition>
  );
}
