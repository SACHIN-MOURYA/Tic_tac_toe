import React from 'react';

export const Cell = ({ value, onClick }) => {
  return (
    <div className="cell" onClick={onClick}>
      {value}
    </div>
  );
};
