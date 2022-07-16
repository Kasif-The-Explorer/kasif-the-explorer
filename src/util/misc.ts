import { ContentType, ViewType } from "@store/viewStore";
import path from "path-browserify";
import _icons from "./icons.json";

export function getSvgImportPath(path: string, isFull = false): string {
  return isFull ? `..${path}?component` : `../icons/${path}.svg?component`;
}

interface Icons {
  folderNames: Record<string, string>;
  fileNames: Record<string, string>;
  fileExtensions: Record<string, string>;
  languageIds: Record<string, string>;
  iconDefinitions: { [key: string]: { iconPath: string } };
}

const icons: Icons = _icons;

export function findIconForContent(
  type: ContentType | ViewType,
  name: string,
  open?: boolean
): string {
  name = name.toLocaleLowerCase();

  switch (type) {
    case "folder":
      if (icons.folderNames[name]) {
        if (open) {
          return getSvgImportPath(`${icons.folderNames[name]}-open`);
        }
        return getSvgImportPath(icons.folderNames[name]);
      }
      if (open) {
        return getSvgImportPath("folder-open");
      }
      return getSvgImportPath("folder");
    case "file":
      let id: string;

      if (icons.fileNames[name]) {
        id = getSvgImportPath(icons.fileNames[name]);
      } else {
        const parsed = path.parse(name);
        parsed.ext = parsed.ext.slice(1);
        let extension = parsed.ext;

        if (parsed.name.includes(".")) {
          const suffix = parsed.name.split(".").slice(1).join(".");
          if (icons.fileExtensions[`${suffix}.${extension}`]) extension = `${suffix}.${extension}`;
        }

        if (icons.fileExtensions[extension]) {
          extension = icons.fileExtensions[extension];
        }

        if (icons.iconDefinitions[extension]) {
          id = getSvgImportPath(icons.iconDefinitions[extension].iconPath, true);
        } else {
          id = getSvgImportPath("document");
        }
      }

      return id;
    case "meta":
      return getSvgImportPath("folder");
  }
}

export function findKindForContent(type: ContentType | ViewType, name: string): string {
  let extension = name
    .toLocaleLowerCase()
    .split("")
    .reverse()
    .join("")
    .split(".")[0]
    .split("")
    .reverse()
    .join("");

  let result = icons.fileExtensions[extension];

  if (result && name.includes(".")) {
    return `${capitalize(result)} ${type}`;
  }
  return capitalize(type!);
}

export function createFallDown(amount: number, max: number) {
  return {
    in: { opacity: 1, transform: "translateY(0)" },
    out: { opacity: 0, transform: `translateY(-${((amount * 100) / max) * 2}%)` },
    common: { transformOrigin: "top" },
    transitionProperty: "transform, opacity",
  };
}

export function createSlideIn(amount: number, max: number) {
  return {
    in: { opacity: 1, transform: "translateX(0)" },
    out: { opacity: 0, transform: `translateX(-${((amount * 100) / max) * 2}%)` },
    common: { transformOrigin: "left" },
    transitionProperty: "transform, opacity",
  };
}

export function minMax(list: [number, number]): [number, number] {
  if (list[0] <= list[1]) {
    return list;
  }

  return list.reverse() as [number, number];
}

export function capitalize(value: string) {
  return typeof value !== "string" ? "" : value.charAt(0).toUpperCase() + value.slice(1);
}

export function getContentScrollY(): number | undefined {
  const target = document.querySelector(".scroll-y-target");

  if (target) {
    return target.scrollTop;
  }
}

export function setContentScrollY(scrollTop: number): void {
  const target = document.querySelector(".scroll-y-target");

  if (target) {
    target.scrollTo({ top: scrollTop, behavior: "smooth" })
  }
}
