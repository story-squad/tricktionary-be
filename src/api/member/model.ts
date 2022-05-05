import db from "../../dbConfig";
import { v4 } from "uuid";
export default { add, findById, findByEmail };

async function add(
  email: string,
  username: string,
  fullname: string | undefined,
  location: string | undefined,
  external: string | undefined
) {
  const uuId = v4();
  let member_id;
  try {
    member_id = await db("Member")
      .insert({
        id: uuId,
        email,
        username,
        fullname,
        location,
        external,
      })
      .returning("id");
  } catch (err: any) {
    return { ok: false, message: "error" };
  }
  return { ok: true, member_id: member_id[0] };
}

async function findById(member_id: string) {
  let member: any;
  try {
    member = await db("Member").where({ id: member_id }).first();
  } catch (err: any) {
    return { ok: false, message: "error" };
  }
  return { ok: true, member };
}

async function findByEmail(email: string) {
  let member: any;
  try {
    member = await db("Member").where({ email }).first();
  } catch (err: any) {
    return { ok: false, message: "error" };
  }
  return { ok: true, member };
}
