import { EnvironmentType } from "@store/evironmentStore";
import { useState, useEffect } from "react";
import { sendAsyncMessage } from "./useSendMessage";

export function useEnvironment(): EnvironmentType {
  let [environment, setEnvironment] = useState<EnvironmentType>(null);

  useEffect(() => {
    sendAsyncMessage("env-query", {}).then((result) => {
      if (result.error) {
        setEnvironment("web");
      } else {
        setEnvironment(result.message.payload as EnvironmentType);
      }
    });
  }, []);

  return environment;
}

export function usePlatform(): string {
  let [platform, setPlatform] = useState<string>("");

  useEffect(() => {
    sendAsyncMessage("platform-query", {}).then((result) => {
      if (result.error) {
        setPlatform("");
      } else {
        setPlatform(result.message.payload);
      }
    });
  }, []);

  return platform;
}
