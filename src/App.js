import FundMe from './FundMe';
import Dice from './Dice';

import "./App.css";


function App() {
  
  const [currentGame, setCurrentGame] = useState('');
  const showAllGameEntry = useMemo(()=> currentGame === '', currentGame);
  const backHomeView = useCallback(() => {
    setCurrentGame('');
  }, [setCurrentGame]);

  return (
    <div className="App container">
      {showAllGameEntry ? (
        <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setCurrentGame('FUND_ME'))}
        >
          Play FundMe
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setCurrentGame('DICE'))}
        >
          Play Dice
        </button>
        </div>
      )}
     {currentGame === 'FUND_ME' && (<FundMe goBack={backHomeView} />)}
     {currentGame === 'DICE' && (<Dice goBack={backHomeView} />)}
    </div>
  );
}

export default App;
