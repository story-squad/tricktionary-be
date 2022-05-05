import createHttpError from "http-errors";
import axios from "axios";
import { log } from "../../logger";

// encode a string in Base64
const encode64 = (str: string): string =>
  Buffer.from(str, "binary").toString("base64");

// decode a string from Base64
const decode64 = (str: string): string =>
  Buffer.from(str, "base64").toString("binary");

/**
 * Auth Basic
 * @param clientID Clever API client id
 * @param clientSecret Clever API client secret
 */
const cleverBasic = (clientID: string, clientSecret: string) =>
  axios.create({
    baseURL: `${process.env.CLEVER_BASE_URL}}`,
    headers: {
      Authorization: `Basic ${encode64(`${clientID}:${clientSecret}`)}`,
      "Content-Type": "application/json",
    },
  });

/**
 * Auth Bearer
 * @param token Student Token
 * @returns an instance of axios with baseURL & headers set accordingly.
 */
const cleverBearer = (token: string) =>
  axios.create({
    baseURL: `${process.env.CLEVER_BASE_URL}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * verify your Clever student, teacher, or Admin
 *
 * WORKS with identites:
 *
 *   ilc_DEMO_STUDENT_TOKEN
 *
 *   ilc_DEMO_TEACHER_TOKEN
 *
 *   ilc_DEMO_SCHOOL_ADMIN_TOKEN
 *
 * reference: https://dev.clever.com/reference#clevercomoauthtokeninfo
 */
const cleverStudentRequired = async (req: any, res: any, next: any) => {
  // log(`middleware for ${process.env.CLEVER_BASE_URL}`);
  try {
    // parse header
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/Bearer (.+)/);
    if (!match) throw new Error("Missing student id");
    const studentID = match[1];
    const result = await cleverBearer(studentID.trim()).get("/oauth/tokeninfo");
    log(`status : ${result.status}`);
    // check status
    if (result.status !== 200) throw new Error("error verifying student");
    // attach result
    req.tokenInfo = result.data;
    log("success!");
    // continue
    next();
  } catch (err: any) {
    next(createHttpError(401, err.message));
  }
};

export { cleverStudentRequired, cleverBasic, cleverBearer, encode64, decode64 };
