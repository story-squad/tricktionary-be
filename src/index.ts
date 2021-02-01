import { socketApp } from "./app";
import { AddressInfo } from "net";
import * as dotenv from "dotenv";

dotenv.config();
const server = socketApp.listen(5000, "127.0.0.1", () => {
  const { port, address } = server.address() as AddressInfo;
  console.log(`Server listening @ http://${address}${port ? `:${port}` : ""}`); // for devs convenience
});
