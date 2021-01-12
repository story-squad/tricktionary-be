import express from "express";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

const app = express();
const JSON_SIZE_LIMIT = "5mb";

app.use(
  bodyParser.json({
    limit: JSON_SIZE_LIMIT
  })
);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.status(200).json({ api: "𝜋", timestamp: Date.now() })
);

export { app };
