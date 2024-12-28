import React, { useState, useEffect } from 'react';
import { Cell } from './Cell';  // Import the Cell component
import { makeMoveAPI } from '../utils/api';  // Import API functions

const Board = ({ gameId, player, socket }) => {
  const [board, setBoard] = useState(Array(9).fill(null));  // Initialize empty board
  const [isXNext, setIsXNext] = useState(true);  // Track the next player
  const [winner, setWinner] = useState(null);  // Track winner state

  useEffect(() => {
    const checkWinner = (board) => {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      for (let [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];  // Return the winner ('X' or 'O')
        }
      }
      return null;
    };

    const winner = checkWinner(board);
    setWinner(winner);
  }, [board]);

  const handleClick = (index) => {
    if (board[index] || winner) return;  // Prevent clicking if cell is filled or game is over

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    makeMoveAPI(gameId, index);  // Make move via API
  };

  return (
    <div className="board">
      <div className="grid">
        {board.map((cell, index) => (
          <Cell key={index} value={cell} onClick={() => handleClick(index)} />
        ))}
      </div>
      {winner && <h3>{winner} wins!</h3>}
    </div>
  );
};

export default Board;
