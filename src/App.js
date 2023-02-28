import { useState, useMemo, useCallback } from "react";
import FundMe from "./FundMe";
import Dice from "./Dice";
import Button from "./Dice/components/Button";

import "./App.css";
import { AccountProvider } from "./Dice/context/Account";

function App() {
  document.title = "The Greate Water Gate";
  const [currentGame, setCurrentGame] = useState("DICE");
  const showAllGameEntry = useMemo(() => currentGame === "", [currentGame]);
  const backHomeView = useCallback(() => {
    setCurrentGame("");
  }, [setCurrentGame]);

  return (
    <div className="App container">
      { showAllGameEntry && (
        <div>
          <h1 className="title"> The Greate Water Gate </h1>
          <div className="game-list">
            <Button text={ "FundMe" } onClick={ () => setCurrentGame("FUND_ME") }/>
            <Button text={ "Dice" } onClick={ () => setCurrentGame("DICE") }/>
          </div>
        </div>
      ) }
      { currentGame === "FUND_ME" && <FundMe goBack={ () => backHomeView() }/> }
      <AccountProvider>
        { currentGame === "DICE" && <Dice goBack={ () => backHomeView() }/> }
      </AccountProvider>
    </div>
  );
}

export default App;
