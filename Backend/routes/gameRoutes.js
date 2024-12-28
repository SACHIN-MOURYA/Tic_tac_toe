const express = require('express');
const router = express.Router();

// Example: Endpoint to fetch game details (optional)
router.get('/game/:gameId', (req, res) => {
    const { gameId } = req.params;
    const game = games[gameId];
    if (game) {
        res.json(game);
    } else {
        res.status(404).json({ error: 'Game not found' });
    }
});

module.exports = router;
