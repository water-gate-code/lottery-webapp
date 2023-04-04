import { shortenAddress } from "../utils";

export function Address({ address }) {
  return (
    <span className="text-primary" title={address}>
      {shortenAddress(address)}
    </span>
  );
}
