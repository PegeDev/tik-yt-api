const fs = require("fs");
const path = require("path");
const axios = require("axios");
const textToImage = require("text-to-image");
const base64img = require("base64-img");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
// const Buffer = require('buffer')
const uploadYoutube = async (req, res) => {
  try {
    const { data, author, url, hashtag } = req.body;

    const down = async (url) => {
      const createFile = await fs.createWriteStream(
        path.resolve("./public/media/videos/test.mp4")
      );
      const req = await axios
        .get(url, {
          responseType: "stream",
        })
        .then((res) => {
          res.data.pipe(createFile);
          createFile.on("finish", () => {
            createFile.close();
          });
          return res.headers["content-length"];
        });
      return {
        size: (req / 1024 ** 2).toFixed(2),
        fileName: "./public/media/videos/test.mp4",
      };
    };
    async function videoWithWatermark(vidPath, watermarkPath, resultPath) {
      if (fs.existsSync(path.resolve(resultPath))) {
        fs.unlinkSync(path.resolve(resultPath));
      }
      const optVideo = {
        position: "SC",
      };
      var video = await new ffmpeg(path.resolve(vidPath));
      const files = await video.fnAddWatermark(
        watermarkPath,
        path.resolve(resultPath),
        optVideo
      );
      return files;
    }
    const watermark = await textToImage.generate(`source: tiktok/@${author}`, {
      fontFamily: "Poppins",
      fontWeight: 800,
      textColor: "#FFFFFF",
      textAlign: "center",
      bgColor: "transparent",
      fontPath: path.resolve("./public/fonts/Unbounded-SemiBold.ttf"),
    });
    const filepath = await base64img.imgSync(
      watermark,
      path.resolve("./public/media/watermark/"),
      author
    );
    const downloadFile = await down(url);
    const pathDownload = downloadFile.fileName;
    const convertWm = await videoWithWatermark(
      pathDownload,
      filepath,
      `./public/media/videos/${author}.mp4`
    );
    const resWm = await convertWm;

    const oauth2Client = new OAuth2(
      process.env.clientID,
      process.env.clientSecret,
      "/auth/google/callback"
    );
    oauth2Client.credentials = {
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken,
    };
    console.log(req.user);
    console.log(oauth2Client.credentials);
    const { title, description } = data;
    await google
      .youtube({
        version: "v3",
        auth: oauth2Client,
      })
      .videos.insert(
        {
          part: "snippet,contentDetails,status",
          requestBody: {
            snippet: {
              title,
              description,
              tags: [],
              //   categoryId: 18,
            },
            status: {
              selfDeclaredMadeForKids: false,
              privacyStatus: "public",
            },
          },
          media: {
            body: await fs.createReadStream(resWm),
          },
        },
        function (err, data, response) {
          if (err) {
            console.error("Error: " + err);
            res.json({
              status: "error",
              message: err,
            });
            if (fs.existsSync(filepath)) {
              fs.unlinkSync(filepath);
            }

            if (fs.existsSync(resWm)) {
              fs.unlinkSync(resWm);
            }
          }
          if (data) {
            res.json({
              status: "ok",
              data: data,
            });
            if (fs.existsSync(filepath)) {
              fs.unlinkSync(filepath);
            }

            if (fs.existsSync(resWm)) {
              fs.unlinkSync(resWm);
            }
          }
          if (response) {
            console.log("Status code: " + response.statusCode);
          }
        }
      );

    // res.status(200).json({ pathVidWatermark });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { uploadYoutube };
