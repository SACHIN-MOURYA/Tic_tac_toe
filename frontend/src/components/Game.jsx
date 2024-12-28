import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Board from './Board';  // Import the Board component
import { startGameAPI, resetGameAPI } from '../utils/api';  // Import API functions

const Game = () => {
  const [gameId, setGameId] = useState(null);  // Track game ID
  const [player, setPlayer] = useState(null);  // Track current player ('X' or 'O')
  const [isGameStarted, setIsGameStarted] = useState(false);  // Track if game has started
  const socket = io('http://localhost:5000');  // Socket connection to backend

  // Start the game when the component mounts
  // useEffect(() => {
  //   socket.on('gameStarted', (id) => {
  //     setGameId(id);   // Set the game ID when the game starts
  //     setPlayer('X');  // Set player to 'X' for the first player
  //     setIsGameStarted(true);  // Set game state to started
  //   });

  //   // Clean up the socket listener when the component unmounts
  //   return () => {
  //     socket.off('gameStarted');
  //   };
  // }, []);

  const startGame = async () => {
    const id = await startGameAPI();  // Start game via API
    setGameId(id);
    setPlayer('X');
    setIsGameStarted(true);  // Mark the game as started
  };

  const resetGame = async () => {
    await resetGameAPI(gameId);  // Reset game via API
    socket.emit('resetGame', gameId);  // Notify the backend to reset
    setIsGameStarted(false);  // Reset game state to not started
    setGameId(null);  // Clear game ID
  };

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      {!isGameStarted ? (
        <button onClick={startGame} className="start-button">
          Start Game
        </button>
      ) : (
        <>
          <Board gameId={gameId} player={player} socket={socket} />
          <button onClick={resetGame} className="reset-button">
            Reset Game
          </button>
        </>
      )}
    </div>
  );
};

export default Game;
