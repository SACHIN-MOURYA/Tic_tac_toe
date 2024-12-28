const games = require('../models/game');
const { checkWinner } = require('../utils/gameUtils');

function handleSocketConnection(io) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Join a game
        socket.on('joinGame', (gameId) => {
            if (!games[gameId]) {
                games[gameId] = {
                    players: [],
                    board: Array(9).fill(null),
                    turn: 0, // 0 for Player 1, 1 for Player 2
                };
            }

            const game = games[gameId];
            if (game.players.length < 2) {
                game.players.push(socket.id);
                socket.join(gameId);
                socket.emit('playerAssigned', game.players.length); // 1 or 2
                if (game.players.length === 2) {
                    io.to(gameId).emit('gameStart', 'Game started! Player 1 (O) goes first.');
                }
            } else {
                socket.emit('error', 'Game is full.');
            }
        });

        // Handle moves
        socket.on('makeMove', ({ gameId, index }) => {
            const game = games[gameId];
            if (!game) return;

            const playerIndex = game.players.indexOf(socket.id);
            if (playerIndex !== game.turn) {
                socket.emit('error', 'Not your turn.');
                return;
            }

            if (game.board[index] !== null) {
                socket.emit('error', 'Cell already taken.');
                return;
            }

            game.board[index] = playerIndex === 0 ? 'O' : 'X';
            game.turn = 1 - game.turn; // Switch turn

            io.to(gameId).emit('boardUpdate', game.board);

            // Check for win or draw
            const winner = checkWinner(game.board);
            if (winner) {
                io.to(gameId).emit('gameEnd', `Player ${winner} wins!`);
                delete games[gameId];
            } else if (game.board.every((cell) => cell !== null)) {
                io.to(gameId).emit('gameEnd', 'Draw!');
                delete games[gameId];
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
            for (const [gameId, game] of Object.entries(games)) {
                const index = game.players.indexOf(socket.id);
                if (index !== -1) {
                    io.to(gameId).emit('gameEnd', `Player ${index + 1} disconnected. Game over.`);
                    delete games[gameId];
                }
            }
        });
    });
}

module.exports = { handleSocketConnection };
