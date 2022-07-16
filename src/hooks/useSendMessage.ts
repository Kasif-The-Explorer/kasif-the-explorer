import { useState } from "react";
import { CahnnelApi } from "../util/channelApi";

let bridge: CahnnelApiInstance = new CahnnelApi();

// @ts-ignore
// bridge.addEventListener("message", (e) => console.log(e.detail.data));
export interface MessengerResponse<T> {
  loading?: boolean;
  error: boolean;
  response: T | null;
}

export interface WebView2APIResponse {
  error: boolean;
  message: any;
}

export function useSendMessage<T>(): [
  (channel: string, message: any) => void,
  MessengerResponse<T>
] {
  const [result, setResult] = useState<MessengerResponse<T>>({
    loading: false,
    error: false,
    response: null,
  });

  const execute = (channel: string, message: any) => {
    setResult({ loading: true, error: false, response: null });
    bridge.send<any>({ channel, message }).then((response) => {
      setResult({
        loading: false,
        error: response.error,
        response: response.message,
      });
    });
  };

  return [execute, result];
}

export async function sendAsyncMessage(
  channel: string,
  message: any
): Promise<WebView2APIResponse> {
  const response = await bridge.send<WebView2APIResponse>({ channel, message });
  return response;
}
