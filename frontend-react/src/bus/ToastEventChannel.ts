import { EventBus } from "./EventBus";

export const toastEventChannel = EventBus<{
  onAddToast: (content: string) => void;
}>();
