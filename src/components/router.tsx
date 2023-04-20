import { createBrowserRouter, useParams } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import { App } from "./App";
import { Home } from "./Home";
import { GamePlay } from "./GamePlay";
import { parseGameType } from "../utils/casino";
import { selectChain } from "../store/slices/chain";
import { useAppSelector } from "../hooks";
import { WrongNetwork } from "./WrongNetwork";
import { selectApp } from "../store/slices/app";
import { NeedMetamask } from "./NeedMetamask";

const GamePlayWrapper = () => {
  const { gameType: gameTypeKey } = useParams();
  if (gameTypeKey === undefined) throw new Error("Invalid game type");
  const gameType = parseGameType(gameTypeKey);
  return <GamePlay key={gameTypeKey} gameType={gameType} />;
};
const ValidNetwork = ({ node }: { node: JSX.Element }) => {
  const { metamaskInstalled } = useAppSelector(selectApp);
  const chain = useAppSelector(selectChain);
  const supportChain = chain.id !== null && chain.support;
  if (!metamaskInstalled) {
    return <NeedMetamask />;
  }
  if (!supportChain) {
    return <WrongNetwork />;
  }
  return node;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/play/:gameType",
        element: <ValidNetwork node={<GamePlayWrapper />} />,
      },
    ],
  },
]);
