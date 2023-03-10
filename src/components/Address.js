import { formatAddress } from "../utils";

export function Address({ address }) {
  return (
    <span className="text-primary" title={address}>
      {formatAddress(address)}
    </span>
  );
}
