import createAIGame from "../routeHandlers/gameCreationRouteHandler";

const express = require("express");
const router = express.Router();


router.post('/AI',createAIGame)

module.exports = router