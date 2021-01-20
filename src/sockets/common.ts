// import * as dotenv from "dotenv";
import util from "util";
import { exec as cmd } from "child_process";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
const localAxios = axios.create({
  baseURL: `${process.env.BASE_URL || 'http://0.0.0.0'}:${process.env.PORT || 5000}`
});
localAxios.defaults.timeout = 10000;
const LC_LENGTH: number = 4; // number of characters in lobbyCode
export { LC_LENGTH, localAxios, fortune };

const exec = util.promisify(cmd);

async function fortune() {
  // returns a promise
  const { stdout, stderr } = await exec('fortune');
  return { fortune: stdout, error: stderr }
}
