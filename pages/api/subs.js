const ytch = require("yt-channel-info");

async function handler(req, res) {
  const { channelId } = req.body;

  await ytch
    .getChannelInfo(channelId)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(200).send(err);
    });
}

export default handler;
