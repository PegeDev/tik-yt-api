const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const YoutubeStrategy = require("passport-youtube-v3").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: [
        "profile https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtubepartner",
      ],
      authorizationParams: {
        access_type: "offline",
        approval_prompt: "force",
      },
    },
    function (accessToken, refreshToken, profile, cb) {
      // const channelId = profile._json.items[0].id;
      // console.log(JSON.stringify(params));
      cb(null, { profile, accessToken, refreshToken });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
