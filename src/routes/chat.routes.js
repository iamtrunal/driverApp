const router = require("express").Router();

const {
    getChatByUserId,
    getAllChatData,
} = require("../controllers/chat.controller");

router.get("/get-chat-by-userid", getChatByUserId);
router.get("/get-all-chat", getAllChatData);

module.exports = router;