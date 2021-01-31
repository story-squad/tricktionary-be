import { socketApp } from "./app";
import { AddressInfo } from "net";
import * as dotenv from "dotenv";

dotenv.config();

const PORT: any = process.env.PORT;
const portNumber: number = Number(PORT || 8081);

const server = socketApp.listen(portNumber, "0.0.0.0", () => {
  const { port, address } = server.address() as AddressInfo;
  console.log(`Server listening @ http://${address}:${port}`); // for devs convenience
});
