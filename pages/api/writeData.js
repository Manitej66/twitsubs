import { db } from "../../config/firebase";

async function handler(req, res) {
  const { email, secret, token, username } = req.body;
  try {
    if ((await db.collection("users").doc(email).get()).exists) {
      await db.collection("users").doc(email).update({
        email,
        token,
        secret,
        username,
        status: false,
      });
    } else {
      await db.collection("users").doc(email).set({
        email,
        token,
        secret,
        username,
        status: false,
      });
    }
    res.send("success");
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export default handler;
