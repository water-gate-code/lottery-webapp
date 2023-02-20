import FundMe from './FundMe';
import "./App.css";


function App() {
  
  const [currentGame, setCurrentGame] = useState('');
  const showAllGame = useMemo(()=> currentGame === '', currentGame);
  const backHomeView = useCallback(() => {
    setCurrentGame('');
  }, [setCurrentGame]);

  return (
    <div className="App container">
     <FundMe goBack={backHomeView} />
     <button
          type="button"
          className="btn btn-primary"
          onClick={() => setCurrentGame('FUND_ME')}
        >
          Connect Wallet
        </button>

    </div>
  );
}

export default App;
