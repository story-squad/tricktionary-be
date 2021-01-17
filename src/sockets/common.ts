// import * as dotenv from "dotenv";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
const localAxios = axios.create({
  baseURL: `${process.env.BASE_URL || 'http://0.0.0.0'}:${process.env.PORT || 5000}`
});
localAxios.defaults.timeout = 10000;
const LC_LENGTH: number = 4; // number of characters in lobbyCode
export { LC_LENGTH, localAxios };
