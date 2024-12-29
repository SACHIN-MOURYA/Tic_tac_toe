import React, { useState } from 'react';

const JoinGame = ({ onJoin }) => {
  const [gameId, setGameId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameId.trim()) {
      onJoin(gameId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center mb-6">Join Game</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="gameId" className="block text-sm font-medium text-gray-700">
              Enter Game ID
            </label>
            <input
              type="text"
              id="gameId"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="Enter game ID to join or create"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinGame;
