import { shortenAddress } from "../utils";

export function Address({ address }: { address: string }) {
  return (
    <span className="text-primary" title={address}>
      {shortenAddress(address)}
    </span>
  );
}
