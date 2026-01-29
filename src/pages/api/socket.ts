import { Server } from "socket.io";
import { promises as fs } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

async function readDb() {
  const fileContent = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(fileContent);
}

async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("chat message", async (msg) => {
        const db = await readDb();
        db.messages.push(msg);
        await writeDb(db);
        io.emit("chat message", msg);
      });

      socket.on("sign-off", () => {
        io.emit("status-verified");
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });
  }
  res.end();
};

export default SocketHandler;
