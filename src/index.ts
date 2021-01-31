import { socketApp } from "./app";
import { AddressInfo } from "net";
import * as dotenv from "dotenv";

dotenv.config();
const apiPort = process.env.API_PORT ? Number(process.env.API_PORT) : 8080;
const server = socketApp.listen(apiPort, "0.0.0.0", () => {
  const { port, address } = server.address() as AddressInfo;
  console.log(`Server listening @ http://${address}${port ? `:${port}` : ""}`); // for devs convenience
});
