const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());  // Allow cross-origin requests from frontend

// In-memory store for games
let games = {};

// Function to initialize a new game
const createNewGame = () => {
  return {
    board: Array(9).fill(null),  // 3x3 board, initially empty
    currentPlayer: 'O',  // Player 1 starts with 'O'
    gameId: Math.random().toString(36).substring(2, 9),  // Generate a random game ID
    status: 'ongoing',  // The game is ongoing at the start
  };
};

// Route to start a new game
app.post('/startGame', (req, res) => {
  const newGame = createNewGame();
  games[newGame.gameId] = newGame;  // Save the game to the games store
  console.log(`Game started with ID: ${newGame.gameId}`);
  res.json({ gameId: newGame.gameId });  // Send the game ID back to the client
});

// Route to make a move
app.post('/makeMove', (req, res) => {
  const { gameId, index } = req.body;
  const game = games[gameId];

  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  if (game.board[index] !== null) {
    return res.status(400).json({ error: 'Cell is already occupied' });
  }

  // Make the move
  game.board[index] = game.currentPlayer;

  // Check if there's a winner
  const winner = checkWinner(game.board);
  if (winner) {
    game.status = 'completed';
    return res.json({ winner });
  }

  // Switch player turn
  game.currentPlayer = game.currentPlayer === 'O' ? 'X' : 'O';

  res.json({ board: game.board, currentPlayer: game.currentPlayer });
});

// Route to reset the game
app.post('/resetGame', (req, res) => {
  const { gameId } = req.body;
  const game = games[gameId];

  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  // Reset the game board
  game.board = Array(9).fill(null);
  game.status = 'ongoing';
  game.currentPlayer = 'O';

  res.json({ message: 'Game reset successfully', board: game.board });
});

// Helper function to check if a player has won
const checkWinner = (board) => {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
    [0, 4, 8], [2, 4, 6],              // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];  // Return the winner ('O' or 'X')
    }
  }
  return null;  // No winner
};

// Start the server
app.listen(port, () => {
  console.log(`Tic Tac Toe server running on http://localhost:${port}`);
});
