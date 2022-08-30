const chatModel = require("../webSocket/models/chat.model");
const chatRoom = require("../webSocket/models/chatRoom.model");
const authModel = require("../models/auth.model");
const APIResponse = require("../helper/APIResponse");
const status = require("http-status");

exports.getChatByUserId = async (req, res) => {
    try {

        const findChatRoom = await chatRoom.find({
            user1: req.body.user_id
        }).lean();
        console.log("findChatRoom::", findChatRoom.length);

        const findChatRoom2 = await chatRoom.find({
            user2: req.body.user_id
        }).lean();
        console.log("findChatRoom2::", findChatRoom2.length);

        if (findChatRoom.length == 0 && findChatRoom2.length == 0) {

            res.status(status.NOT_FOUND).json(
                new APIResponse("Data Not Exist", "false", 404, "0")
            )

        }
        else {

            if (findChatRoom.length > 0) {

                const response = [];
                for (const getLastMsg of findChatRoom) {

                    console.log("getLastMessage::", getLastMsg._id);

                    const getUserData = await authModel.findOne(
                        {
                            _id: getLastMsg.user1
                        }
                    ).lean();

                    const findChat1 = await chatModel.findOne(
                        {
                            chatRoomId: getLastMsg._id
                        }
                    ).lean();
                    console.log("findChat1::",findChat1);

                    const chatMessage = findChat1.chat;
                    const getLastMessage = chatMessage[chatMessage.length - 1];
                    console.log("getLastMessage:::", getLastMessage.message);

                    const lastMsgResponse = {
                        profile: getUserData.profile[0].res,
                        chatRoomId: findChat1.chatRoomId,
                        username: getUserData.username,
                        message: getLastMessage.message,
                    }
                    response.push(lastMsgResponse)

                }

                res.status(status.OK).json(
                    new APIResponse("Get Chat Details By UserId", true, 200, 1, response)
                )

            } else {

                const response2 = [];
                for (const getLastMsg2 of findChatRoom2) {

                    console.log("getLastMessage::", getLastMsg2._id);

                    const getUserData2 = await authModel.findOne(
                        {
                            _id: getLastMsg2.user2
                        }
                    ).lean();

                    const findChat2 = await chatModel.findOne(
                        {
                            chatRoomId: getLastMsg2._id
                        }
                    ).lean();
                    console.log("findChat2::",findChat2);

                    const chatMessage2 = findChat2.chat;
                    const getLastMessage2 = chatMessage2[chatMessage2.length - 1];
                    console.log("getLastMessage2:::", getLastMessage2.message);

                    const lastMsgResponse2 = {
                        profile: getUserData2.profile[0].res,
                        chatRoomId: findChat2.chatRoomId,
                        username: getUserData2.username,
                        message: getLastMessage2.message,
                    }
                    response2.push(lastMsgResponse2)
                }

                res.status(status.OK).json(
                    new APIResponse("Get Chat Details By UserId", true, 200, 1, response2)
                )

            }

        }

    } catch (error) {

        console.log("Error:", error);
        res.status(status.INTERNAL_SERVER_ERROR).json(
            new APIResponse("Something Went Wrong", "false", 500, "0", error.message)
        )

    }
}

exports.getAllChatData = async (req, res) => {
    try {

        const findChatRoom = await chatModel.findOne({
            chatRoomId: req.body.chat_room_id
        }).select("-__v").lean();
        console.log("findChatRoom::", findChatRoom);


        if (findChatRoom == null) {

            res.status(status.NOT_FOUND).json(
                new APIResponse("Data Not Exist", "false", 404, "0")
            )

        } else {

            res.status(status.OK).json(
                new APIResponse("Get All Chat Details By UserId", true, 200, 1, findChatRoom)
            )

        }



        // if (findChatRoom == null && findChatRoom2 == null) {

        //     res.status(status.NOT_FOUND).json(
        //         new APIResponse("Data Not Exist", "false", 404, "0")
        //     )

        // } else {

        //     if (findChatRoom) {

        //         const findChat1 = await chatModel.findOne(
        //             {
        //                 chatRoomId: findChatRoom._id
        //             }
        //         );
        //         console.log("findChat1::", findChat1);

        //         res.status(status.OK).json(
        //             new APIResponse("Get All Chat Details By UserId", true, 200, 1, findChat1)
        //         )

        //     } else {

        //         const findChat2 = await chatModel.findOne(
        //             {
        //                 chatRoomId: findChatRoom2._id
        //             }
        //         );
        //         console.log("findChat2::", findChat2);

        //         res.status(status.OK).json(
        //             new APIResponse("Get All Chat Details By UserId", true, 200, 1, findChat2)
        //         )

        //     }

        // }

    } catch (error) {

        console.log("Error:", error);
        res.status(status.INTERNAL_SERVER_ERROR).json(
            new APIResponse("Something Went Wrong", "false", 500, "0", error.message)
        )

    }
}