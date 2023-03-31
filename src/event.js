class EventEmitter {
  #listenersOf = {};
  #events = [];

  constructor(supportEvents) {
    this.#events = supportEvents || [];
  }

  dispatch(event, data) {
    console.log(`[barsino.event] ${event}`, data);
    if (!this.#listenersOf[event]) return;

    setTimeout(() => {
      this.#listenersOf[event].forEach((callback) => callback(data));
    }, 0);
  }
  on(event, callback) {
    if (!this.#events.includes(event))
      throw new Error("Event is not supported");
    if (!this.#listenersOf[event]) this.#listenersOf[event] = [];
    this.#listenersOf[event].push(callback);
  }
  removeListener(event, callback) {
    if (!this.#listenersOf[event]) return;
    const subscribers = this.#listenersOf[event];
    const index = subscribers.findIndex(
      (subscriber) => subscriber === callback
    );
    subscribers.splice(index, 1);
  }
}

export const Events = {
  CREATE_GAME: "CREATE_GAME",
  COMPLETE_GAME: "COMPLETE_GAME",
};
export const eventEmitter = new EventEmitter(
  Object.keys(Events).map((key) => Events[key])
);
