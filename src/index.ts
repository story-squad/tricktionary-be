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

const PORT = process.env.PORT || 8080;

const server = socketApp.listen(PORT, () => {
  // const { port, address } = server.address() as AddressInfo;
  // const localAddress = `listening @ http://${address}${port ? `:${port}` : ""}`;
  const localAddress = `listening @ port ${PORT}`;
  let details = withRedis ? `w / ${redisDetail} & ` : "w / ";
  details += withDB ? dbDetail : "";
  console.log(
    boxMyText(
      ["", title, "", localAddress, "", `${details}`, ""],
      localAddress.length + pad
    )
  );
});
