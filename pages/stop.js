import React from "react";
import { Link, Text, Button } from "@geist-ui/react";
import { auth } from "../config/firebase";
import { useRouter } from "next/router";

const stop = () => {
  const router = useRouter();
  return (
    <div>
      <Text
        style={{ width: 300, textAlign: "left", margin: "20px auto" }}
        blockquote
      >
        <Link
          block
          type="warning"
          href="https://twitter.com/settings/applications/19205954"
        >
          Revoke access
        </Link>
        <Text p>1. Click above link and revoke access</Text>
        <Text p>2. Logout</Text>
        <Button
          type="error"
          onClick={() => {
            auth.signOut().then(() => {
              router.replace("/");
            });
          }}
        >
          Logout
        </Button>
      </Text>
    </div>
  );
};

export default stop;
