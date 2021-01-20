import { fortune } from "./common";

async function handleFortune(io: any, socket: any) {
  try {
    const pid = socket.id;
    const result = await fortune();
    io.to(pid).emit("fortune", result.fortune); // private message fortune to player
  } catch (err) {
    console.log({ error: err });
  }
}

export default handleFortune;
