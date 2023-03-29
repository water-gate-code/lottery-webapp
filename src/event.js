class EventEmitter {
  #events = {};
  dispatch(event, data) {
    console.log(`[event] ${event}`, data);
    if (!this.#events[event]) return;

    setTimeout(() => {
      this.#events[event].forEach((callback) => callback(data));
    }, 0);
  }
  on(event, callback) {
    if (!this.#events[event]) this.#events[event] = [];
    this.#events[event].push(callback);
  }
  removeListener(event, callback) {
    if (!this.#events[event]) return;
    const subscribers = this.#events[event];
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
export const eventEmitter = new EventEmitter();
