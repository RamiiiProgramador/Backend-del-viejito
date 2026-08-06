const express = require("express");
const {
    createGame,
    getGames,
    getGameById,
    updateGame,
    deleteGame
} = require("../controllers/gameController");

const router = express.Router();

router.route("/").post(createGame).get(getGames);
router.route("/:id").get(getGameById).put(updateGame).delete(deleteGame);

module.exports = router;
