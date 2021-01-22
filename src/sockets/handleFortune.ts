import { fortune, privateMessage } from "./common";

async function handleFortune(io: any, socket: any) {
  try {
    const result = await fortune();
    privateMessage(io, socket, "fortune", result.fortune)
  } catch (err) {
    console.log({ error: err });
    privateMessage(io, socket, "error", err);
  }
}

export default handleFortune;
