import { payMoneyAndCreateGame } from "./utils";

export function NewGame() {
  return (
    <button onClick={() => payMoneyAndCreateGame("0.1", "big")}>Create</button>
  );
}
