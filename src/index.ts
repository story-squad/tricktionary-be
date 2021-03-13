import { socketApp } from "./app";
import { AddressInfo } from "net";
import * as dotenv from "dotenv";

import { boxMyText } from "./boxMyText";

dotenv.config();
const withRedis = process.env.REDIS_HOST?.length;
const withDB = process.env.DATABASE_URL?.length;
const redisDetail = "asynchronyous io";
const dbDetail = "persistence";
let title = withDB ? "😎 " : "😈 ";
title += "Tricktionary API";
title += withRedis ? " 😎" : "";
const pad = 11;
if (!withDB) {
  console.log("warning: no DATABASE_URL was found.");
}
const server = socketApp.listen(8080, "127.0.0.1", () => {
  const { port, address } = server.address() as AddressInfo;
  const localAddress = `listening @ http://${address}${port ? `:${port}` : ""}`;
  let details = withRedis ? `w / ${redisDetail} & ` : "w / ";
  details += withDB ? dbDetail : "";
  console.log(
    boxMyText(["", title, "", localAddress, "",`${details}`, ""], localAddress.length + pad)
  );
});
