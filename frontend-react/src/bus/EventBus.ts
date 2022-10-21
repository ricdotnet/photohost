type EventKey = string;
type EventHandler<T = any> = (payload: T) => void;
type EventMap = Record<EventKey, EventHandler>;
type Events = Record<keyof EventMap, EventHandler>
type EventPayload = unknown[];

interface EventBusInterface<T = EventMap> {
  subscribe<Key extends keyof T>(key: Key, handler: EventHandler): void;

  dispatch<Key extends keyof T>(key: Key, ...payload: EventPayload): void;

  unsubscribe<Key extends keyof T>(key: Key): void;
}

export class EventBus implements EventBusInterface {
  private static instance: EventBus;

  private events: Events = {};

  public static getInstance(): EventBus {
    if ( !this.instance ) {
      this.instance = new EventBus();
    }
    return this.instance;
  }

  subscribe(key: EventKey, handler: EventHandler): void {
    this.events[key] = handler;
  }

  dispatch(key: EventKey, ...payload: EventPayload): void {
    if ( this.events[key] ) {
      this.events[key](payload);
    }
  }

  unsubscribe(key: EventKey): void {
    delete this.events[key];
  }
}
