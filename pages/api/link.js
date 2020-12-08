const axios = require("axios");
const Cryptr = require("cryptr");
import Twitter from "twitter-lite";
import { db } from "../../config/firebase";
import {
  setIntervalAsync,
  clearIntervalAsync,
} from "set-interval-async/dynamic";

async function handler(req, res) {
  const { channelId, email } = req.body;

  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api"
      : "https://twitsubs.vercel.app/api";

  const cryptr = new Cryptr(process.env.NEXT_PUBLIC_PASSWORD);

  try {
    if ((await db.collection("users").doc(email).get()).exists) {
      db.collection("users")
        .doc(email)
        .onSnapshot(async (doc) => {
          const client = new Twitter({
            consumer_key: process.env.NEXT_PUBLIC_KEY,
            consumer_secret: process.env.NEXT_PUBLIC_SECRET,
            access_token_key: cryptr.decrypt(doc.data().token),
            access_token_secret: cryptr.decrypt(doc.data().secret),
          });

          async function refreshData() {
            //while (doc.data().status) {
            const profile = await client.get("users/show", {
              screen_name: doc.data().username,
            });
            let data = profile.description;

            if (String(data).length > 130) {
              return res.send(
                "Bio length must be less than 130 characters inorder to work"
              );
            }

            const up = String(data).split("~").pop().split("|")[0];

            if (up.includes("subs on YouTube")) {
              data = data.replace(up, "").replace("~", "").replace("|", "");
            }

            const sub_count = await axios.post(`${url}/subs`, {
              channelId: channelId,
            });
            const subs = sub_count.data.subscriberCount;

            await client
              .post("account/update_profile", {
                description:
                  data + "~ " + String(subs) + " subs on YouTube 😎 |",
              })
              .then((response) => {
                res.status(200).send("Successfully linked");
              })
              .catch((e) => {
                if ("errors" in e) {
                  // Twitter API error
                  if (e.errors[0].code === 88) {
                    setTimeout(function () {
                      refreshData();
                    }, 900000);
                    res.send(
                      "limit exceeded! the service will start after 15min"
                    );
                  } else {
                    res.send(e);
                  }
                } else {
                  res.send(e);
                  // non-API error, e.g. network problem or invalid JSON in response
                }
              });
          }
          // }

          // while (doc.data().status) {
          //   await refreshData();
          // }
          refreshData();

          const timer = setIntervalAsync(async () => {
            await refreshData();
          }, 120 * 1000);

          if (!doc.data().status) {
            await clearIntervalAsync(timer);
          }
        });
    } else {
      res.send("Please enable service");
    }
  } catch (error) {
    res.send(error);
  }
}
export default handler;
