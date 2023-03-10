// hdajzs82mskp
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGF2ZS1tYXR0aGV3cyJ9.axZFJTZj_3tG-2p-x-iI_ZhKuGm1KbZZh3oeYen0MLY

import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat, Channel } from "stream-chat-react";
import "@stream-io/stream-chat-css/dist/css/index.css";
import { useCookies } from "react-cookie";

import MessagingContainer from "./components/MessagingContainer";

import Auth from "./components/Auth";

import Video from "./components/Video";

const filters = { type: "messaging" };
const options = { state: true, presence: true, limit: 10 };
const sort = { last_message_at: -1 };

const API_KEY = 'zppj7uqn7ymq'
const API_SECRET = 'k6csk8dcz2qkzjgd53aw9h9dzz6a4dnu6ersk53upnsj9hmary4kdn64ra4tyhfb'
const APP_ID = '1238726'

const client = StreamChat.getInstance(API_KEY);

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const [channel, setChannel] = useState(null);

  const [users, setUsers] = useState(null);

  const authToken = cookies.AuthToken;

  useEffect(async () => {
    if (authToken) {
      const { users } = await client.queryUsers({ role: "user" });
      setUsers(users);
    }
  }, []);

  const setupClient = async () => {
    try {
      await client.connectUser(
        {
          id: cookies.UserId,
          name: cookies.Name,
          hashedPassword: cookies.HashedPassword,
        },
        authToken
      );

      const channel = await client.channel("gaming", "gaming-demo", {
        name: "Gaming Demo",
      });

      setChannel(channel);
    } catch (err) {
      console.log(err);
    }
  };

  if (authToken && setupClient());

  return (
    <>
      {!authToken && <Auth></Auth>}
      {authToken && (
        <Chat client={client} darkMode={true}>
          <Channel channel={channel}>
            <Video></Video>

            <MessagingContainer users={{ users }} ></MessagingContainer>
          </Channel>
        </Chat>
      )}
    </>
  );
};

export default App;
