
# Tic Tac Toe Multiplayer

A real-time multiplayer Tic Tac Toe game where two players join using a unique game ID. The backend uses **Node.js** and **Socket.IO** to handle communication between players.

## Features

- **Two-player game**: Players join a game using a unique `gameID`.
- **Turn-based gameplay**: Player 1 enters 'O' and Player 2 enters 'X' on their turn.
- **Real-time updates**: The game updates in real-time as players make their moves.
- **Game ID**: Each game session is identified by a unique `gameID`, allowing two players to join and play together.
- **Socket.IO communication**: The server listens for player actions and sends updates to both players using Socket.IO.

## Technologies Used

- **Node.js**: A JavaScript runtime for building the backend server.
- **Socket.IO**: A library for real-time communication between the backend and the players’ browsers.
- **React**: A JavaScript library for building the user interface of the game.

## Installation

### Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/SACHIN-MOURYA/Tic_tac_toe
```

### Install Dependencies

Navigate to the project directory and install the necessary dependencies:

```bash
cd tic-tac-toe
npm install
```

### Run the Application

To start the server, run the following command:

```bash
node server/index.js
npm run dev

```

The server will start at `http://localhost:3001`.

## How to Play

1. **Join a Game**: Open two different browser windows and navigate to `http://localhost:5173/`. 
2. **Game ID**: A unique `gameID` will be generated for each game session. Player 1 and Player 2 will use the same `gameID` to join the game.
3. **Turns**: 
   - Player 1 will enter 'O' on their turn.
   - Player 2 will enter 'X' on their turn.
4. **Game Updates**: The game board will update in real-time as each player makes their move.
5. **Game Over**: Once a player wins or the game ends in a draw, the game will display the result.

## Example Flow

1. Player 1 joins the game with `gameID`.
2. Player 2 joins the same game with the same `gameID`.
3. Player 1 makes a move by selecting a cell to place 'O'.
4. Player 2 makes a move by selecting a cell to place 'X'.
5. The game continues until one player wins or it ends in a draw.

