const Chat = require("../models/chat");
const User = require("../models/user");
const usersIdWithSocketId = require("./userData");
exports.joinmessage = (io, socket) => {
    socket.on("disconnect", (socket) => {

        usersIdWithSocketId.filter(itm => itm.sid != socket.id)

    })
    console.log("----socket id " + socket.id);
    socket.on("joined", ({ name, u1id, u2id }, callback) => {
        // console.log(name + " joined and id is " + u1id);
        let existingChatId;
        let alreadyThere = false;

        User.findById(u1id, (err, u) => {
            if (err) {
                console.log(err);
            }
            let chats = u.chats;

            for (let i = 0; i < chats.length; i++) {
                if (chats[i].userId === u2id) {
                    alreadyThere = true;
                    existingChatId = chats[i].chatId;
                    break;
                }
            }
            if (alreadyThere === true) {
                Chat.findById(existingChatId, (err, echat) => {
                    if (err) {
                        console.log(err);
                    }
                    usersIdWithSocketId.push({
                        uid: u1id,
                        sid: socket.id,
                        cid: echat._id,
                    });

                    callback(echat);
                });
            } else if (alreadyThere === false) {
                let chatData = {
                    u1id: u1id,
                    u2id: u2id,
                };

                const chat = new Chat(chatData);
                chat.save((err, chat) => {
                    if (err) {
                        console.log(err);
                    } else {
                        usersIdWithSocketId.push({
                            uid: u1id,
                            sid: socket.id,
                            cid: chat._id,
                        });
                        const chatId = chat._id;

                        User.findByIdAndUpdate(
                            u1id,
                            {
                                $push: {
                                    chats: {
                                        chatId: chatId,
                                        userId: u2id,
                                    },
                                },
                            },
                            (err, firstUuser) => {
                                if (err) {
                                    console.log(err);
                                }
                                User.findByIdAndUpdate(
                                    u2id,
                                    {
                                        $push: {
                                            chats: {
                                                chatId: chatId,
                                                userId: u1id,
                                            },
                                        },
                                    },
                                    (err, secondUuser) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            callback(chat);
                                        }
                                    }
                                );
                            }
                        );
                    }
                });
            }
        });
    });
};

exports.handleMessages = (socket, io) => {
    socket.on("chat-message", ({ chat: chat, toUser, cid }) => {
        let target;
        console.log("--user id " + toUser)
        console.log("--to chat " + cid)
        console.log(chat);
        usersIdWithSocketId.forEach((u) => {
            console.log(u)
            if (u.uid == toUser && u.cid == cid) {
                io.to(u.sid).emit("r-chat-message", chat)
                User.findById(u.sid, (err, sender) => {
                    if (err) {

                    }
                    else {

                        let sendersChats = sender.chats;
                        let targetId = "";
                        // console.log("this is 0000 " + sendersChats)
                        sendersChats.forEach((sendersChat) => {
                            console.log(sendersChat.userId + " >>>> " + u.uid + " >>>>>>> " + sendersChat.chatId)
                            if (sendersChat.userId == u.uid) {
                                console.log(">>>>>>>" + sendersChat.chatId)
                                Chat.findByIdAndUpdate(sendersChat.chatId,
                                    {
                                        $push: {
                                            messages: chat
                                        }
                                    }
                                    , (err, myChat) => {
                                        if (err) {
                                            console.log("Not able to save it bro !")
                                        }
                                        else {
                                            console.log("Yes chat saved to DB")
                                        }
                                    })
                            }
                        })
                    }
                })
                console.log("yes found")

            }
        })



    });
};
