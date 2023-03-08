import { LOCAL_DICE } from "./contracts";
import { GOERILI_DICE } from "./goerliContracts";

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
const DICE = process.env.NODE_ENV === 'development' ? LOCAL_DICE : GOERILI_DICE;

export default DICE;