import { useState, useEffect } from "react";

export interface SvgResponse {
  loading: boolean;
  error: unknown;
  image: string | undefined;
}

export function useSvg(icon: string): SvgResponse {
  const [state, setState] = useState<SvgResponse>({ loading: true, image: undefined, error: "" });

  useEffect(() => {
    try {
      import(/* @vite-ignore */ icon).then((data) => {
        setState({ loading: false, image: data.default, error: "" });
      });
    } catch (error) {
      setState({ loading: false, image: undefined, error: error });
    }
  }, []);

  return state;
}
