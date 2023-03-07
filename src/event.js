class EventEmitter {
  #events = {};
  dispatch(event, data) {
    console.log(`dispatch ${event}`, data);
    if (!this.#events[event]) return;
    this.#events[event].forEach((callback) => callback(data));
  }
  subscribe(event, callback) {
    if (!this.#events[event]) this.#events[event] = [];
    this.#events[event].push(callback);
  }
  unsubscribe(event, callback) {
    if (!this.#events[event]) return;
    const subscribers = this.#events[event];
    const index = subscribers.findIndex((subscriber) => subscriber == callback);
    subscribers.splice(index, 1);
  }
}

export const Events = {
  CREATE_GAME: "CREATE_GAME",
  // use an enum to keep track of events similar to action types set as variables in redux
};
export const eventEmitter = new EventEmitter();
