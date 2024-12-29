import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import GameBoard from './components/GameBoard';
import JoinGame from './components/JoinGame';

const socket = io('http://localhost:3001');

function App() {
  const [gameId, setGameId] = useState('');
  const [gameState, setGameState] = useState('waiting'); // 'waiting' | 'playing' | 'finished'
  const [board, setBoard] = useState(Array(9).fill(null)); // (string | null)[]
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [winner, setWinner] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null); // 'X' | 'O' | null

  useEffect(() => {
    setPlayerId(socket.id);

    socket.on('waitingForPlayer', () => {
      setGameState('waiting');
    });

    socket.on('gameStart', ({ players, currentPlayer, board }) => {
      setGameState('playing');
      setCurrentPlayer(currentPlayer);
      setBoard(board);
      const player = players.find((p) => p.id === socket.id);
      if (player) {
        setPlayerSymbol(player.symbol);
      }
    });

    socket.on('gameUpdate', ({ board, currentPlayer }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
    });

    socket.on('gameOver', ({ winner, board }) => {
      setBoard(board);
      setWinner(winner);
      setGameState('finished');
    });

    socket.on('playerDisconnected', () => {
      setGameState('waiting');
      setWinner('disconnect');
    });

    socket.on('gameFull', () => {
      alert('Game is full!');
    });

    return () => {
      socket.off('waitingForPlayer');
      socket.off('gameStart');
      socket.off('gameUpdate');
      socket.off('gameOver');
      socket.off('playerDisconnected');
      socket.off('gameFull');
    };
  }, []);

  const handleJoinGame = (id) => {
    setGameId(id);
    socket.emit('joinGame', id);
  };

  const handleMove = (position) => {
    if (gameState === 'playing' && currentPlayer === socket.id && !board[position]) {
      socket.emit('makeMove', { gameId, position });
    }
  };

  const renderStatus = () => {
    if (gameState === 'waiting') {
      return 'Waiting for another player to join...';
    }
    if (gameState === 'playing') {
      return currentPlayer === socket.id ? 'Your turn' : "Opponent's turn";
    }
    if (winner === 'draw') {
      return "It's a draw!";
    }
    if (winner === 'disconnect') {
      return 'Opponent disconnected';
    }
    return winner === playerSymbol ? 'You won!' : 'You lost!';
  };

  if (!gameId) {
    return <JoinGame onJoin={handleJoinGame} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Tic Tac Toe</h1>
        <div className="mb-4 text-center">
          <p className="text-lg font-medium">Game ID: {gameId}</p>
          <p className="text-lg font-medium">You are: {playerSymbol}</p>
          <p className="text-lg font-medium mt-2">{renderStatus()}</p>
        </div>
        <GameBoard board={board} onMove={handleMove} />
      </div>
    </div>
  );
}

export default App;
