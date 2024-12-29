import React from 'react';
import { Circle, X } from 'lucide-react';

const GameBoard = ({ board, onMove }) => {
  const renderCell = (position) => {
    const value = board[position];
    return (
      <button
        key={position}
        className="w-20 h-20 border border-gray-300 flex items-center justify-center text-4xl focus:outline-none hover:bg-gray-50"
        onClick={() => onMove(position)}
        disabled={value !== null}
      >
        {value === 'O' && <Circle className="w-10 h-10 text-blue-500" />}
        {value === 'X' && <X className="w-10 h-10 text-red-500" />}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-2 bg-white">
      {board.map((_, index) => renderCell(index))}
    </div>
  );
};

export default GameBoard;
