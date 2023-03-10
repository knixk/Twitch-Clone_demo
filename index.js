require('dotenv').config()
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const { v1: uuidv1 } = require("uuid");
const { connect } = require("getstream");
const StreamChat = require("stream-chat").StreamChat;
const path = require("path")

const PORT = process.env.PORT || 8000;

const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET 
const APP_ID = process.env.APP_ID
const NODE_ENV = process.env.NODE_ENV

//
app.use(cors());
app.use(express.json());


// to join both front and backend on deployment
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

// in prod
// if (NODE_ENV == “production”) {
//    app.use(express.static(“client/build”));
//    app.get(“*”, (req, res) => {
//       res.sendFile(path.resolve(__dirname, “client”, “build”, “index.html”));
//    });

// sign up

app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userId = uuidv1();

    const hashedPassword = await bcrypt.hash(password, 10);

    let client = StreamChat.getInstance(API_KEY, API_SECRET)
    if (!client.secret){
        client.secret=API_SECRET
    }

    const token = client.createToken(userId);

    res.status(200).json({ username, userId, hashedPassword, token });

    console.log(username, password);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

// login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    let client = StreamChat.getInstance(API_KEY, API_SECRET)
    if (!client.secret){
        client.secret= API_SECRET
    }

    const chatClient = StreamChat.getInstance(
       API_KEY,
       API_SECRET
    );

    const { users } = await chatClient.queryUsers({ name: username });

    if (!users.length)
      return res.status(400).json({ message: "User does not exist" });

    const success = await bcrypt.compare(password, users[0].hashedPassword);

    const token = client.createToken(users[0].id);

    const confirmedName = users[0].name;

    const userId = users[0].id;

    if (success) {
      res.status(200).json({ token, username: confirmedName, userId });
    } else {
      res.status(500).json({ message: "login failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

app.listen(PORT, () => console.log("connected.."));
