import { useState, useMemo, useCallback } from 'react';
import FundMe from './FundMe';
import Dice from './Dice';
import Button from "./components/Button"

import "./App.css";


function App() {

  const [currentGame, setCurrentGame] = useState('');
  const showAllGameEntry = useMemo(() => currentGame === '', currentGame);
  const backHomeView = useCallback(() => {
    setCurrentGame('');
  }, [setCurrentGame]);

  return (
    <div className="App container">
      {showAllGameEntry && (
        <div>
          <Button text={'Play FundMe'} onClick={() => setCurrentGame('FUND_ME')} />
          <Button text={'Play Dice'} onClick={() => setCurrentGame('DICE')} />
        </div>
      )}
      {currentGame === 'FUND_ME' && (<FundMe goBack={backHomeView} />)}
      {currentGame === 'DICE' && (<Dice goBack={backHomeView} />)}
    </div>
  );
}

export default App;
