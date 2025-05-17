import './App.css';
import GameBoard from './components/game/GameBoard';

function App() {
  return (
    <div className="App">
      <GameBoard targetNumber={12} level={6} />
    </div>
  );
}

export default App;
