export interface WebviewGuardProps {
  children: React.ReactElement;
}

export function WebviewGuard(props: WebviewGuardProps) {
  if (import.meta.env.MODE === "development") {
    return props.children;
  }

  if ("WebView2API" in window) {
    return props.children;
  }

  return <div>No Webview2API Detected</div>;
}
