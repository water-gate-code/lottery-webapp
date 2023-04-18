import { shortenAddress } from "../utils/tools";

export function Address({ address }: { address: string }) {
  return <span className="text-primary">{shortenAddress(address)}</span>;
}
