type EventKey = string;
type EventHandler<T = any> = (payload: T) => void;
type EventMap = Record<EventKey, EventHandler>;
type Events<E> = Record<keyof E, EventHandler>;

interface EventBusInterface<T extends EventMap> {
  on<Key extends keyof T>(key: Key, handler: T[Key]): void;

  emit<Key extends keyof T>(key: Key, ...payload: Parameters<T[Key]>): void;

  off<Key extends keyof T>(key: Key): void;
}

export function EventBus<E extends EventMap>(): EventBusInterface<E> {
  const events: Partial<Events<E>> = {};

  const on: EventBusInterface<E>['on'] = (key, handler) => {
    events[key] = handler;
  };

  const emit: EventBusInterface<E>['emit'] = (key, payload) => {
    const evt = events[key]!;
    evt(payload);
  };

  const off: EventBusInterface<E>['off'] = (key) => {
    delete events[key];
  };

  return { on, emit, off };
}
