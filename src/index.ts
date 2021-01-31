import { socketApp } from "./app";
import { AddressInfo } from "net";
import * as dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const server = socketApp.listen(PORT, "0.0.0.0", () => {
  const { port, address } = server.address() as AddressInfo;
  console.log(`Server listening @ http://${address}${port ? `:${port}` : ""}`); // for devs convenience
});
