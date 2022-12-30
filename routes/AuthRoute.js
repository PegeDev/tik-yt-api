const router = require("express").Router();
const passport = require("passport");
const axios = require("axios");
const { userLogged } = require("../middleware/Auth");
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    accessType: "offline",
    prompt: "consent",
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/auth/login/failed",
  })
);

router.get("/auth/login/success", userLogged, (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      user: req.user,
      message: "Successfully Loged in",
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authenticated" });
  }
});

router.get("/auth/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Login Failure",
  });
});

router.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});
// router.get('/profile', userLogged, function(req, res) {

//   var oauth2Client = new OAuth2(
//       process.env.clientID,
//       process.env.clientSecret,
//       "/auth/google/callback"
//   );

//   oauth2Client.credentials = {
//       access_token: req.user.access_token,
//       refresh_token: req.user.refresh_token
//   };

//   google.youtube({
//       version: 'v3',
//       auth: oauth2Client
//   }).subscriptions.list({
//       part: 'snippet',
//       mine: true,
//       headers: {}
//   }, function(err, data, response) {
//       if (err) {
//           console.error('Error: ' + err);
//           res.json({
//               status: "error"
//           });
//       }
//       if (data) {
//           console.log(data);
//           res.json({
//               status: "ok",
//               data: data
//           });
//       }
//       if (response) {
//           console.log('Status code: ' + response.statusCode);
//       }
//   });
// });
router.get("/shorts", userLogged, async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://yt.lemnoslife.com/channels?part=shorts&id=UC1yN4qlGJ_Kn0Z3wOgkuySQ`
    );
    await res.status(200).json({ data });
  } catch (err) {
    console.log(err);
  }
});
router.get(
  "/auth/google",
  passport.authenticate("google", {
    accessType: "offline",
    prompt: "consent",
    scope: [
      "profile openid https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtubepartner",
    ],
  })
);

module.exports = router;
