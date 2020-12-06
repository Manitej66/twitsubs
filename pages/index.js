import Head from "next/head";
import { Text, Code, Tree, Image, Button, Row, Loading } from "@geist-ui/react";
import { useRouter } from "next/router";
import { auth, provider } from "../config/firebase";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import Cryptr from "cryptr";
const cryptr = new Cryptr(process.env.NEXT_PUBLIC_PASSWORD);

export default function Home() {
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(true);
  const router = useRouter();
  useEffect(() => {
    auth.onAuthStateChanged((userob) => {
      setUser(userob);
      setLoad(false);
    });
  }, []);

  if (user) router.replace("/dashboard");

  if (load) {
    return (
      <Row
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
        }}
      >
        <Loading>Loading</Loading>
      </Row>
    );
  }

  return (
    <div style={{ textAlign: "center", fontFamily: "inter" }}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Text h3 style={{ padding: 10 }}>
        Welcome to <Code>Youtubio</Code>
      </Text>
      <Text p style={{ padding: 10 }}>
        Youtubio is a tool that automatically updates your twitter bio with the
        subscriber count every 24hrs<span>🐱‍🏍</span>
      </Text>
      <Tree
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tree.Folder name="How to use ?">
          <Tree.File name="login with twitter" />
          <Tree.File name="enter channel URL" />
          <Tree.File name="thats it" />
        </Tree.Folder>
      </Tree>

      <Button
        onClick={async () => {
          await auth
            .signInWithPopup(provider)
            .then(async (res) => {
              Cookie.set("token", cryptr.encrypt(res.credential.accessToken));
              Cookie.set("secret", cryptr.encrypt(res.credential.secret));
              Cookie.set("desc", res.additionalUserInfo.profile.description);
              Cookie.set("username", res.additionalUserInfo.username);
            })
            .catch((err) => console.log(err));
        }}
        shadow
        style={{ marginTop: 20 }}
        type="secondary"
      >
        Get started
      </Button>

      <Image.Browser
        style={{ width: 350, marginTop: 20 }}
        url="https://twitter.com/PrataManitej"
        anchorProps={{ rel: "nofollow" }}
      >
        <Image src="/ss.png" />
      </Image.Browser>
    </div>
  );
}
