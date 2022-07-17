import { Store } from "tauri-plugin-store-api";

const store = new Store(".settings.dat");

export async function setPersistentData(key: string, value: any): Promise<void> {
  await store.set(key, value);
}

export async function getPersistentData<T>(key: string): Promise<T | undefined> {
  const value = await store.get(key);

  if (value) {
    return value as T;
  }

  return undefined;
}
