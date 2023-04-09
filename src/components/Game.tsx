import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { GameRenderer } from "../games";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectCasino } from "../store/slices/chain";
import { fetchGame, selectGame } from "../store/slices/game";
import { GameResult } from "../utils/casino";

export function Game() {
  const { gameId } = useParams();
  const casino = useAppSelector(selectCasino);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentGamePlay, gameResults } = useAppSelector(selectGame);

  useEffect(() => {
    if (!casino || !gameId) return;
    dispatch(fetchGame({ casino, gameId }));
  }, [gameId, casino, dispatch]);

  useEffect(() => {
    if (gameId) {
      const result = gameResults[gameId] ?? null;
      if (result !== null) {
        switch (result) {
          case GameResult.win:
            navigate(`/result/win`);
            break;
          case GameResult.lose:
            navigate(`/result/lose`);
            break;
          case GameResult.draw:
            navigate(`/result/draw`);
            break;
          default:
            break;
        }
      }
    }
  });

  if (currentGamePlay.game.status === "loading")
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary m-5" role="status"></div>
      </div>
    );
  if (currentGamePlay.game.value === null) return <div>Game not found!</div>;
  return <GameRenderer game={currentGamePlay.game.value} />;
}
