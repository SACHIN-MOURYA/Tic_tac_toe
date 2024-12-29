import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://tictactoe-ai96.onrender.com",
    methods: ["GET", "POST"]
  }
});

const games = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinGame', (gameId) => {
    let game = games.get(gameId);
    
    if (!game) {
      game = {
        id: gameId,
        players: [],
        currentPlayer: 0,
        board: Array(9).fill(null),
        gameState: 'waiting'
      };
      games.set(gameId, game);
    }

    if (game.players.length >= 2) {
      socket.emit('gameFull');
      return;
    }

    game.players.push({
      id: socket.id,
      symbol: game.players.length === 0 ? 'O' : 'X'
    });

    socket.join(gameId);
    
    if (game.players.length === 2) {
      game.gameState = 'playing';
      io.to(gameId).emit('gameStart', {
        players: game.players,
        currentPlayer: game.players[0].id,
        board: game.board
      });
    } else {
      socket.emit('waitingForPlayer');
    }
  });

  socket.on('makeMove', ({ gameId, position }) => {
    const game = games.get(gameId);
    
    if (!game || game.gameState !== 'playing') return;
    
    const playerIndex = game.players.findIndex(p => p.id === socket.id);
    if (playerIndex === -1 || playerIndex !== game.currentPlayer) return;
    
    if (game.board[position] === null) {
      game.board[position] = game.players[playerIndex].symbol;
      game.currentPlayer = (game.currentPlayer + 1) % 2;
      
      const winner = checkWinner(game.board);
      if (winner) {
        game.gameState = 'finished';
        io.to(gameId).emit('gameOver', { winner, board: game.board });
      } else if (!game.board.includes(null)) {
        game.gameState = 'finished';
        io.to(gameId).emit('gameOver', { winner: 'draw', board: game.board });
      } else {
        io.to(gameId).emit('gameUpdate', {
          board: game.board,
          currentPlayer: game.players[game.currentPlayer].id
        });
      }
    }
  });

  socket.on('disconnect', () => {
    games.forEach((game, gameId) => {
      if (game.players.some(p => p.id === socket.id)) {
        game.gameState = 'finished';
        io.to(gameId).emit('playerDisconnected');
        games.delete(gameId);
      }
    });
  });
});

function checkWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});