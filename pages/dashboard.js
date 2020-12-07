import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  Image,
  Text,
  Badge,
  useToasts,
} from "@geist-ui/react";
import { auth } from "../config/firebase";
import Link from "next/link";
import Axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const dashboard = () => {
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(false);
  const [click, setClick] = useState(false);
  const [info, setInfo] = useState();
  const [url, setUrl] = useState("");
  const router = useRouter();
  useEffect(() => {
    auth.onAuthStateChanged((userob) => {
      setUser(userob);
    });
  }, []);

  const getSubsCount = () => {
    if (url.includes("youtube.com/channel")) {
      const pattern = "youtube.com/channel/([^#&?]*).*";
      let match = url.match(pattern);
      setLoad(true);
      Axios.post("/api/subs", {
        channelId: match[1],
      })
        .then((res) => {
          console.log(res.data);
          setInfo(res.data);
          setLoad(false);
          setClick(true);
        })
        .catch((e) => console.log(e));
    } else {
      clickToast("URL Incorrect");
    }
  };

  const [, setToast] = useToasts();
  const clickToast = (msg) =>
    setToast({
      text: msg,
      actions: [action],
    });

  const action = {
    name: "cancel",
    passive: true,
    handler: (event, cancel) => cancel(),
  };

  const linkToTwitter = async () => {
    setLoad(true);
    const pattern = "youtube.com/channel/([^#&?]*).*";
    const match = url.match(pattern);
    await Axios.post("/api/link", {
      channelId: match[1],
    })
      .then((res) => {
        setLoad(false);
        clickToast(res.data);
      })
      .catch((e) => {
        clickToast(e.message);
        setLoad(false);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        marginTop: 20,
        minHeight: "95vh",
      }}
    >
      <Input
        width="80%"
        style={{ textAlign: "center" }}
        status={url.includes("youtube.com/channel") ? "default" : "warning"}
        onChange={(e) => setUrl(e.target.value.trim())}
        size="large"
        placeholder="https://www.youtube.com/channel/UCG9Tg84Uso35Omj0sc3ZHIA"
      >
        YouTube channel URL
      </Input>
      <Button
        type="success"
        loading={load}
        onClick={getSubsCount}
        style={{ margin: 20 }}
      >
        Fetch
      </Button>

      {click ? (
        <>
          <Card width="320" style={{ margin: 20 }}>
            <Image
              src={info.authorThumbnails[2].url}
              width="320"
              height="200"
              style={{ objectFit: "cover" }}
            />
            <Text h4 style={{ marginBottom: "0" }}>
              {info.author}
            </Text>
            <Text type="secondary" small>
              {info.description}
            </Text>
            <Card.Footer>
              <Text p>Subscriber count : </Text>
              <Badge type="success">{info.subscriberCount}</Badge>
            </Card.Footer>
          </Card>
          <Button onClick={linkToTwitter} loading={load} size="large">
            Link to Twitter
          </Button>
        </>
      ) : null}
      <Text blockquote>
        To stop the service <Link href="/stop">click here</Link>{" "}
      </Text>
      <Button
        type="error"
        onClick={() => {
          auth.signOut().then(() => {
            Cookies.remove("token");
            Cookies.remove("secret");
            Cookies.remove("desc");
            Cookies.remove("username");
            router.replace("/");
          });
        }}
        style={{ margin: 20 }}
      >
        Logout
      </Button>
    </div>
  );
};
export default dashboard;
