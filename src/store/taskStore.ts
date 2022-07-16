import { randomId } from "@mantine/hooks";
import { atom } from "recoil";

export interface Task {
  id: string;
  label: string;
  description: string;
}

export const taskStoreState = atom<Task[]>({
  key: "TaskStoreState",
  default: [
    {
      id: randomId(),
      label: "Indexing The File System",
      description: "Indexing the file system for performance optimizations.",
    },
    {
      id: randomId(),
      label: "Updating",
      description: "Updating the UI to version 1.2.1",
    },
  ],
});
