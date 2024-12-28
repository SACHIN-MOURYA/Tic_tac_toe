export const startGameAPI = async () => {
    const response = await fetch('http://localhost:5000/startGame', {
      method: 'POST',
    });
    console.log("response");
    const data = await response.json();
    return data.gameId;
  };
  
  export const makeMoveAPI = async (gameId, index) => {
    await fetch('http://localhost:5000/makeMove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, index }),
    });
  };
  
  export const resetGameAPI = async (gameId) => {
    await fetch('http://localhost:5000/resetGame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId }),
    });
  };
  