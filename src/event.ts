class EventEmitter {
  #listenersOf: { [event: string]: Function[] } = {};
  #events: string[] = [];

  constructor(supportEvents: string[]) {
    this.#events = supportEvents || [];
  }

  dispatch(event: string, data: any) {
    console.log(`[barsino.event] ${event}`, data);
    if (!this.#listenersOf[event]) return;

    setTimeout(() => {
      this.#listenersOf[event].forEach((callback) => callback(data));
    }, 0);
  }
  on(event: string, callback: Function) {
    if (!this.#events.includes(event))
      throw new Error("Event is not supported");
    if (!this.#listenersOf[event]) this.#listenersOf[event] = [];
    this.#listenersOf[event].push(callback);
  }
  removeListener(event: string, callback: Function) {
    if (!this.#listenersOf[event]) return;
    const subscribers = this.#listenersOf[event];
    const index = subscribers.findIndex(
      (subscriber) => subscriber === callback
    );
    subscribers.splice(index, 1);
  }
}

export const Events: { [key: string]: string } = {
  CREATE_GAME: "CREATE_GAME",
  COMPLETE_GAME: "COMPLETE_GAME",
};
export const eventEmitter = new EventEmitter(
  Object.keys(Events).map((key) => Events[key])
);
