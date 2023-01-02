require("dotenv").config();
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const PassportSetup = require("./controllers/Passport");
const cookieSession = require("cookie-session");
const AuthRoute = require("./routes/AuthRoute");
const TiktokRoute = require("./routes/TiktokRoute");
// const YoutubeRoute = require("./routes/YoutubeRoute");
const DownloadRoute = require("./routes/DownloadRoute");
const passport = require("passport");
const PORT = 5000;
const app = express();
app.use(express.json());
app.use(
  cookieSession({
    name: "pege-session",
    keys: ["pegedev"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", async (req, res) => {
  res.json({ error: false, msg: "Hello World" });
});
app.use(AuthRoute);
app.use(TiktokRoute);
// app.use(YoutubeRoute);
app.use(DownloadRoute);

app.listen(PORT, () => {
  console.log("App listen on PORT " + PORT);
});
