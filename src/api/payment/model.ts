import db from "../../dbConfig";
import { v4 } from "uuid";
export { add, update };

async function add(member_id: string, amount: number) {
  const uuId: string = v4(); // payment_id
  let payment_id: string;
  try {
    // create a record for this payment, prior to processing
    payment_id = await db("Payment")
      .insert({
        id: uuId,
        amount,
        member_id,
        external: "processing",
      })
      .returning("id");
  } catch (err: any) {
    // NOTE: it should error when the member_id does not exist
    return { ok: false, message: "error" };
  }
  return { ok: true, payment_id };
}

async function update(payment_id: string, external: string) {
  // update the payment with external payment provider detail
  try {
    await db("Payment").update({ external }).where({ id: payment_id });
  } catch (err: any) {
    return { ok: false, message: err.message };
  }
  return { ok: true, message: "success" };
}
