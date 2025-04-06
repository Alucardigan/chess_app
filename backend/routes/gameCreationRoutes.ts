import {createAIGame,createPlayerGame, joinPlayerGame} from "../routeHandlers/gameCreationRouteHandler";

const express = require("express");
const router = express.Router();


router.post('/AI',createAIGame)
router.post('/playerGame',createPlayerGame)
router.post('/joinGame',joinPlayerGame)

module.exports = router