import { useState, useMemo, useCallback } from 'react';
import FundMe from './FundMe';
import Dice from './Dice';
import Button from "./components/Button"
import DevInfo from "./components/DevInfo"

import "./App.css";


function App() {

  const [currentGame, setCurrentGame] = useState('');
  const showAllGameEntry = useMemo(() => currentGame === '', [currentGame]);
  const backHomeView = useCallback(() => {
    setCurrentGame('');
  }, [setCurrentGame]);

  return (
    <div className="App container">
      <DevInfo />
      {showAllGameEntry && (
        <div>
          <h1 className="title"> The Greate Water Gate </h1>
          <div className='game-list'>
            <Button text={'FundMe'} onClick={() => setCurrentGame('FUND_ME')} />
            <Button text={'Dice'} onClick={() => setCurrentGame('DICE')} />
          </div>
        </div>
      )}
      {currentGame === 'FUND_ME' && (<FundMe goBack={() => backHomeView()} />)}
      {currentGame === 'DICE' && (<Dice goBack={() => backHomeView()} />)}
    </div>
  );
}

export default App;
