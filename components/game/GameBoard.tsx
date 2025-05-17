import React, { useState, useEffect } from 'react';
import './GameBoard.css';

interface Cell {
  type: 'number' | 'operation' | 'empty';
  value: string | number;
  color?: string;
  selected?: boolean;
}

interface GameBoardProps {
  targetNumber: number;
  level: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ targetNumber, level }) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selectedCells, setSelectedCells] = useState<{row: number, col: number}[]>([]);
  const [currentResult, setCurrentResult] = useState<number | null>(null);
  const [gameWon, setGameWon] = useState(false);
  
  // Initialize the game board
  useEffect(() => {
    initializeGrid();
  }, [level]);

  const initializeGrid = () => {
    // Create an 8x8 empty grid
    const newGrid: Cell[][] = Array(8).fill(null).map(() => 
      Array(8).fill(null).map(() => ({ type: 'empty', value: '' }))
    );
    
    // For demo purposes, add some numbers and operations based on the screenshots
    // In a real game, this would be generated based on the level
    
    // Add numbers
    newGrid[0][2] = { type: 'number', value: targetNumber, color: '#7B7BE5' }; // Purple number at top
    newGrid[2][0] = { type: 'number', value: 14, color: '#E57BB5' }; // Pink number
    newGrid[2][4] = { type: 'number', value: 2, color: '#7B7BE5' }; // Purple number
    newGrid[5][0] = { type: 'number', value: 4, color: '#E57BB5' }; // Pink number
    newGrid[7][3] = { type: 'number', value: 1, color: '#5BBAE5' }; // Blue number
    
    // Add operations
    newGrid[0][3] = { type: 'operation', value: '+', color: '#FF7B5B' }; // Orange operation
    newGrid[2][1] = { type: 'operation', value: '÷', color: '#FF7B5B' }; // Orange operation
    newGrid[5][1] = { type: 'operation', value: '+', color: '#FF7B5B' }; // Orange operation
    
    setGrid(newGrid);
    setSelectedCells([]);
    setCurrentResult(null);
    setGameWon(false);
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameWon) return;
    
    const cell = grid[row][col];
    if (cell.type === 'empty') return;
    
    // Check if this is a valid next selection
    if (selectedCells.length === 0) {
      // First selection must be a number
      if (cell.type !== 'number') return;
    } else {
      const lastSelected = selectedCells[selectedCells.length - 1];
      const lastCell = grid[lastSelected.row][lastSelected.col];
      
      // Alternate between numbers and operations
      if (lastCell.type === 'number' && cell.type !== 'operation') return;
      if (lastCell.type === 'operation' && cell.type !== 'number') return;
    }
    
    // Add to selected cells
    const newSelectedCells = [...selectedCells, { row, col }];
    setSelectedCells(newSelectedCells);
    
    // Update the grid to show selection
    const newGrid = [...grid];
    newGrid[row][col] = { ...cell, selected: true };
    setGrid(newGrid);
    
    // Calculate current result
    calculateResult(newSelectedCells);
  };
  
  const calculateResult = (selected: {row: number, col: number}[]) => {
    if (selected.length < 1) {
      setCurrentResult(null);
      return;
    }
    
    // Start with the first number
    let firstCell = grid[selected[0].row][selected[0].col];
    let result = Number(firstCell.value);
    
    // Apply operations in sequence
    for (let i = 1; i < selected.length; i += 2) {
      if (i + 1 >= selected.length) break;
      
      const operationCell = grid[selected[i].row][selected[i].col];
      const numberCell = grid[selected[i + 1].row][selected[i + 1].col];
      
      const operation = operationCell.value as string;
      const number = Number(numberCell.value);
      
      switch (operation) {
        case '+':
          result += number;
          break;
        case '-':
          result -= number;
          break;
        case '×':
          result *= number;
          break;
        case '÷':
          result /= number;
          break;
      }
    }
    
    setCurrentResult(result);
    
    // Check if won
    if (result === targetNumber && selected.length > 2) {
      setGameWon(true);
    }
  };
  
  const resetGame = () => {
    initializeGrid();
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="level-indicator">关卡{level}</div>
        <div className="target-number-container">
          <div className="target-number">{targetNumber}</div>
        </div>
      </div>
      
      <div className="game-board">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`} 
                className={`board-cell ${cell.type} ${cell.selected ? 'selected' : ''}`}
                style={{ backgroundColor: cell.type !== 'empty' ? cell.color : undefined }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell.value}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {gameWon && (
        <div className="win-message">
          恭喜胜利!
        </div>
      )}
      
      <div className="game-footer">
        <button className="reset-button" onClick={resetGame}>
          Reset
        </button>
        <div className="current-result">
          {currentResult !== null && `Current: ${currentResult}`}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
