export const shortenAddress = (address: string) => {
  const begin = address.substring(0, 4);
  const end = address.substring(address.length - 4);
  return begin + "•••" + end;
};
export function errorEventParser(errorEvent: any) {
  const message =
    errorEvent.reason?.data?.message ||
    errorEvent.reason?.reason ||
    errorEvent.reason?.message ||
    errorEvent.message;
  return { message };
}
