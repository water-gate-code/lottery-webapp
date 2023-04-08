export const shortenAddress = (address: string) => {
  const begin = address.substring(0, 4);
  const end = address.substring(address.length - 4);
  return begin + "•••" + end;
};
