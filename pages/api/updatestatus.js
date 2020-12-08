import { db } from "../../config/firebase";

async function handler(req, res) {
  const { email, status } = req.body;
  try {
    if ((await db.collection("users").doc(email).get()).exists) {
      await db
        .collection("users")
        .doc(email)
        .update({
          status: status,
        })
        .then(() => {
          res.send("success");
        });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export default handler;
