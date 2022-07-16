import { randomId } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { atom } from "recoil";

export function useTransition(amount: number = 50, id: string = ""): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 50);

    return () => {
      setMounted(false);
    }
  }, []);

  useEffect(() => {
    setMounted(false);
    setTimeout(() => {
      setMounted(true);
    }, amount);
  }, [id]);

  return mounted;
}

export const viewAnimationStore = atom({
  key: "ViewAnimationState",
  default: randomId(),
});
