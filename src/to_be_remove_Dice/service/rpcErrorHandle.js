// https://eips.ethereum.org/EIPS/eip-1474#error-codes
// Example error response:
// {
//   "id": 1337
//   "jsonrpc": "2.0",
//   "error": {
//     "code": -32003,
//     "message": "Transaction rejected"
//   }
// }

// https://eips.ethereum.org/EIPS/eip-1193#provider-errors
//
// interface ProviderRpcError extends Error {
//   code: number;
//   data?: unknown;
// }
const handleRPCError = (err) => {
  const isProviderRPCError = err && err.code
  const isJSONRPCError = err && err.id && err.jsonrpc;
  if (isProviderRPCError) {
    if (`${ err.code }` === '-32603') {
      const message = err?.data?.data?.reason || err?.data?.message;
      window.alert(message);
    } else {
      window.alert(`PROVIDER ERROR: ${ err && err.message }`);
    }
    return;
  }

  if (isJSONRPCError) {
    const message = err.error.message || 'JSON RPC error';
    window.alert(message);
  }
}

export default handleRPCError;