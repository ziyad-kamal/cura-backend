import { findRecord } from "../../../utils/findRecord.js";
import Chatroom from "../../../models/Chatroom.js";
import Message from "../../../models/Message.js";
import { MessageInterface } from "../../../../interfaces/models/MessageInterface.js";

export const storeMessageRepo = async (
    receiver: string,
    sender: string,
    content: string,
    chatroom: string,
):Promise<MessageInterface> => {
    await findRecord(Chatroom,{receiver,sender});

    return (await Message.create({
        content,
        sender,
        receiver,
        chatroom,
    })).populate("sender", "name.first name.last image");
};

export const markMessageAsReadRepo = async (
    chatroom: string,
): Promise<void> => {
    Message.updateMany(
        { chatroom, isRead: false },
        {  isRead: true  },
    );
};
