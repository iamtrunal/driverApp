const router = require("express").Router();

const {
    getChatByUserId
} = require("../controllers/chat.controller");

router.get("/get-chat-by-userid", getChatByUserId)

module.exports = router;