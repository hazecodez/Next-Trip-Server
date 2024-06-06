import { Server, Socket } from "socket.io";
require("dotenv").config();

interface User {
  userId: string;
  socketId: string;
  online?: boolean;
}

function socketConfiguration(server: any) {
  const socketIO = new Server(server, {
    cors: {
      origin: "https://furnicube.shop",
    },
  });
  let users: User[] = [];
  const addUser = (userId: string, socketId: string) => {
    const existUser = users.find((user) => user.userId === userId);
    if (existUser) {
      existUser.socketId = socketId;
      existUser.online = true;
    } else {
      users.push({ userId, socketId, online: true });
    }
    socketIO.emit(
      "userOnline",
      users.filter((user) => user.online)
    );
  };

  const removeUser = async (socketId: string) => {
    const user = users.find((user) => user.socketId === socketId);
    if (user) {
      user.online = false;
    }
    socketIO.emit(
      "userOnline",
      users.filter((user) => user.online)
    );
  };
  const getUser = (userId: string) =>
    users.find((user) => user.userId === userId);

  socketIO.on("connection", (socket: Socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      socketIO.emit("getUsers", users);
    });

    socket.on("sendMessage", ({ senderId, receiverId, text, senderName }) => {
      const user = getUser(receiverId);
      if (user) {
        socketIO.to(user.socketId).emit("getMessage", { senderId, text });
        socketIO
          .to(user.socketId)
          .emit("getNotification", { senderId, text, senderName });
      }
    });

    socket.on("videoCallInitiated", (data) => {
      console.log(data.receiverId);
      const user = getUser(data.receiverId);
      if (user) {
        socketIO.to(user?.socketId).emit("videoCallAccept", {
          username: data.username,
          roomId: data.roomId,
        });
      }
      console.log("emmitted the call event to", user?.socketId);
    });

    socket.on("disconnect", () => {
      console.log("🔥: A user disconnected");
      removeUser(socket.id).catch((err) =>
        console.log("error during removal of user :", err)
      );
      socketIO.emit(
        "userOnline",
        users.filter((user) => user.online)
      );
    });
  });
}

export default socketConfiguration;
