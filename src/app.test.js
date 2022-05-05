const db = require("./dbConfig");
const { createServer } = require("http");
const { socketApp } = require("./app");
const { ioServer } = require("./app");
const Client = require("socket.io-client");
const { newToken } = require("./api/auth/utils");

let default_case = { player_token: "", player_token_old: "" };

jest.setTimeout(1 * 5 * 1000);
describe("Socket.io tests", () => {
  let serverSocket, clientSocket;

  beforeAll((done) => {
    const port = process.env.PORT || 8080;
    socketApp.listen(port, () => {
      // const port = socketApp.address().port;

      console.log("test server port: " + port);

      ioServer.on("connection", (socket) => {
        serverSocket = socket;
      });

      clientSocket = new Client(`http://localhost:${port}`);
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    socketApp.close();
    ioServer.close();
    clientSocket.close();
  });

  test("communicates", (done) => {
    clientSocket.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  test("test new player login", (done) => {
    clientSocket.emit("login", "", async (arg1) => {
      expect(arg1.ok).toBe(true);
      temp = await db.default
        .select("last_user_id")
        .from("Player")
        .where("token", arg1.token);
      expect(temp[0].last_user_id).toBe(clientSocket.id);
      default_case.player_token = arg1.token;
      done();
    });
  });

  test("test returning player login", (done) => {
    clientSocket.on("token update", () => {
      console.log("new token\n" + default_case.player_token);
      console.log("old token\n" + default_case.player_token_old);
      done();
    });
    default_case.player_token_old = default_case.player_token;
    clientSocket.emit("login", default_case.player_token, async (arg1) => {
      console.log(arg1);
      expect(arg1.ok).toBe(true);
      default_case.player_token = arg1.token;
    });
  });
});
