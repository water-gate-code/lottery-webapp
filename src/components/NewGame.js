import { payMoneyAndCreateGame } from "../utils";

import { eventEmitter, Events } from "../event";

async function create() {
  const response = await payMoneyAndCreateGame("0.1", "big");
  eventEmitter.dispatch(Events.CREATE_GAME, response);
}

export function NewGame() {
  return <button onClick={() => create()}>Create</button>;
}
