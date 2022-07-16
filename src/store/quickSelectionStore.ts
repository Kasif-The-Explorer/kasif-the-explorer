import { randomId, useLocalStorage } from "@mantine/hooks";
import { getSvgImportPath, findIconForContent, findKindForContent } from "@util/misc";
import { sendAsyncMessage } from "@hooks/useSendMessage";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { View, ViewContent } from "./viewStore";
import path from "path-browserify";

export interface QuickSelectionState {
  main: View[];
  pinned: View[];
  recent: View[];
}

export const quickSelectionState = atom<QuickSelectionState>({
  key: "QuickSelectionStoreState",
  default: {
    main: [],
    pinned: [],
    recent: [],
  },
});

export type PartialViewContent = Pick<ViewContent, "label" | "path" | "contentSize" | "type" | "modificationDate">;

function partialViewContentToViewContent(partial: PartialViewContent): ViewContent {
  return {
    ...partial,
    kind: findKindForContent(partial.type, partial.label),
    modificationDate: new Date(partial.modificationDate),
    icon: findIconForContent(partial.type, partial.label),
    id: randomId(),
    type: partial.type,
  };
}

export async function getQuickSelectionItems(pinned: string[], recent: string[]): Promise<QuickSelectionState> {
  return { main: [], pinned: [], recent: [] };
  // return new Promise(async (resolve) => {
  //   const quickSelectionMainItems: View[] = [];
  //   const quickSelectionPinnedItems: View[] = [];
  //   const quickSelectionRecentItems: View[] = [];
  //   const possibleItems = [
  //     { label: "Desktop", icon: "folder-mjml" },
  //     {
  //       label: "Downloads",
  //       icon: "folder-download",
  //       defaultSort: (cur: ViewContent, prev: ViewContent): 1 | -1 => {
  //         return cur.modificationDate > prev.modificationDate ? -1 : 1;
  //       },
  //     },
  //     { label: "Documents", icon: "folder-docs" },
  //     { label: "Pictures", icon: "folder-images" },
  //     { label: "Music", icon: "folder-audio" },
  //   ];
  //   const result = await sendAsyncMessage("read-home-content", {});
  //   if (result.message) {
  //     const response = result.message as PartialViewContent[];

  //     for (const item of possibleItems) {
  //       const partialItem = response.find((content) => content.label === item.label);
  //       if (partialItem) {
  //         quickSelectionMainItems.push({
  //           ...partialItem,
  //           icon: getSvgImportPath(item.icon),
  //           id: randomId(),
  //           content: [],
  //           history: [],
  //           popped: [],
  //           type: "folder",
  //           defaultSort: item.defaultSort,
  //         });
  //       }
  //     }

  //     const folderContents = await sendAsyncMessage("read-folders", {
  //       paths: quickSelectionMainItems.map((item) => item.path),
  //     });

  //     if (folderContents.message) {
  //       const folderResult = folderContents.message as {
  //         [key: string]: PartialViewContent[];
  //       };

  //       for (const entry of Object.entries(quickSelectionMainItems)) {
  //         entry[1].content = folderResult[entry[1].path].map(partialViewContentToViewContent) || [];
  //       }

  //       const homePath = await sendAsyncMessage("read-home-dir", {});
  //       quickSelectionMainItems.unshift({
  //         icon: getSvgImportPath("folder-client"),
  //         id: randomId(),
  //         history: [],
  //         popped: [],
  //         content: response?.map(partialViewContentToViewContent) || [],
  //         type: "folder",
  //         label: "This PC",
  //         path: homePath.message.payload,
  //       });

  //       const pinnedItems = await sendAsyncMessage("read-folders", { paths: pinned });

  //       if (pinnedItems.message) {
  //         const pinnedItemsResult = pinnedItems.message as {
  //           [key: string]: PartialViewContent[];
  //         };

  //         for (const entry of Object.entries(pinnedItemsResult)) {
  //           const parsed = path.parse(entry[0]);
  //           quickSelectionPinnedItems.push({
  //             label: parsed.name,
  //             icon: findIconForContent("folder", parsed.name.toLocaleLowerCase()),
  //             path: entry[0],
  //             id: randomId(),
  //             type: "folder",
  //             history: [],
  //             popped: [],
  //             content: entry[1].map(partialViewContentToViewContent),
  //           });
  //         }

  //         const recentItems = await sendAsyncMessage("read-folders", { paths: recent });

  //         if (recentItems.message) {
  //           const recentItemsResult = recentItems.message as {
  //             [key: string]: PartialViewContent[];
  //           };

  //           for (const entry of Object.entries(recentItemsResult)) {
  //             const parsed = path.parse(entry[0]);
  //             quickSelectionRecentItems.push({
  //               label: parsed.name,
  //               icon: findIconForContent("folder", parsed.name.toLocaleLowerCase()),
  //               path: entry[0],
  //               id: randomId(),
  //               type: "folder",
  //               history: [],
  //               popped: [],
  //               content: entry[1].map(partialViewContentToViewContent),
  //             });
  //           }

  //           resolve({
  //             main: quickSelectionMainItems,
  //             pinned: quickSelectionPinnedItems,
  //             recent: quickSelectionRecentItems,
  //           });
  //         }
  //       }
  //     }
  //   }
  // });
}
