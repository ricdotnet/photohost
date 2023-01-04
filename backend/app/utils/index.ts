import { lookup } from "mime-types";

export function resolveImageType(fileName: string, whatToResolve: 'extension' | 'mimeType'): boolean | string {
  const mimeType = lookup(fileName);

  if (!mimeType) return false;

  if (whatToResolve === 'extension') {
    return mimeType.split('/')[1];
  }

  return mimeType;
}