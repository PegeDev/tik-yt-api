const axios = require("axios");
var path = require("path");
var mime = require("mime");
var fs = require("fs");

const Download = async (req, res) => {
  try {
    const currDate = Date.now();
    const { url, author } = req.query;
    const fileName = `${author}-${currDate}.mp4`;
    const output = path.resolve(`./public/media/videos/${fileName}`);
    var mimetype = mime.lookup(output);

    const writer = fs.createWriteStream(output);
    await axios({
      method: "get",
      url: url,
      responseType: "stream",
    }).then((response) => {
      response.data.pipe(writer);
    });
    await writer
      .on("close", () => {

        res.setHeader(
          "Content-disposition",
          "attachment; filename=" + fileName
        );
        res.setHeader("Content-type", mimetype);
        res.download(output, fileName, (err) => {
          if (err) {
            res.send({
              error: err,
              msg: "Problem downloading the file",
            });
          }
        });
        console.log("Success Download files "+fileName);

      })
  } catch (err) {
    console.log(err);
  }
};

module.exports = { Download };
