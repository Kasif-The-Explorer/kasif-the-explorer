export class CahnnelApi extends EventTarget {
  #handlers = {};
  #webChannel = new WebChannelApi();
  #id = 0;
  constructor() {
    super();
    window.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        const handler = this.#handlers[data.id];
        this.dispatchEvent(new CustomEvent("message", { detail: event }));
        if (handler) {
          handler.resolve(data.payload);
        }
        delete this.#handlers[data.id];
      } catch (error) {}
    });
  }
  async send<T>(payload: any): Promise<any> {
    const query = { id: this.#id, channel: payload.channel, message: payload.message };
    return new Promise((resolve, reject) => {
      // @ts-ignore
      if ("electron" in window && "webview" in window.electron) {
        // @ts-ignore
        window.electron.webview.postMessage(JSON.stringify(query));
        this.#handlers[this.#id] = { resolve, reject };
        this.#id++;
      } else {
        // @ts-ignore
        if ("chrome" in window && "webview" in window.chrome) {
          // @ts-ignore
          window.chrome.webview.postMessage(
            JSON.stringify({
              id: this.#id,
              method: "__webview2_api__",
              params: [payload],
            })
          );
          this.#handlers[this.#id] = { resolve, reject };
          this.#id++;
        } else {
          this.#webChannel.send(query);
          this.#handlers[this.#id] = { resolve, reject };
          this.#id++;
        }
      }
    });
  }
}

export class WebChannelApi extends EventTarget {
  async send<T>(query: { id: number; channel: string; message: any }): Promise<void> {
    const url = import.meta.env.VITE_API_URL as string || "/api";
    const req = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ channel: query.channel, message: query.message }),
    });
    const response = await req.json();
    this.resolve(query.id, response);
  }

  resolve(id: number, response: any) {
    window.postMessage(JSON.stringify({ id: id, payload: response }));
  }

  stringResponse(
    payload: string,
    isError: boolean
  ): { error: boolean; message: { payload: string } } {
    return { error: isError, message: { payload: payload } };
  }
}
