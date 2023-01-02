const Signer = require("tiktok-signature");
const axios = require("axios");
const Cheerio = require("cheerio");
const rp = require("request-promise");
const request = require("request");
const TREND_ENDPOINT = "https://m.tiktok.com/api/item_list/";
const FYP_ENDPOINT = "https://www.tiktok.com/foryou";

const TREND_PARAMS = {
  aid: 1988,
  count: 30,
  referer: FYP_ENDPOINT,
  cookieEnabled: true,
  sourceType: 12,
  verifyFp: "",
  secUid: "",
  app_name: "tiktok_web",
  device_platform: "web",
  type: 5,
  appId: 1233,
  minCursor: 0,
  maxCursor: 0,
  language: "id",
  cursor: 0,
  region: "ID",
  lang: "id",
};
const RESPONSE = {
  date: "",
  error: "",
  message: "",
  data: [],
};
const getUrlNoWm = async (videoKey) => {
  try {
    const { data } = await axios({
      url: `https://api16-normal-useast5.us.tiktokv.com/aweme/v1/aweme/detail/?aweme_id=${videoKey}&improve_bitrate=1&mediaType=4`,
    });
    if (data.status_code !== 0) return console.log(data);
    return data.aweme_detail.video.play_addr.url_list[0];
  } catch (err) {
    console.log(err);
  }
};

const main = async () => {
  try {
    // const qsObj = new URLSearchParams(TREND_PARAMS);
    // const qs = qsObj.toString();
    // const signer = new Signer();
    // await signer.init();

    // const signature = await signer.sign(`${TREND_ENDPOINT}?${qs}`);
    // const navigator = await signer.navigator();
    // await signer.close();
    // const getCok = await axios.head(FYP_ENDPOINT);
    // const { data } = await axios({
    //   url: signature.signed_url,
    //   method: "get",
    //   headers: {
    //     Cookie: getCok.headers["set-cookie"],
    //     // ttwid: ttwid,
    //     "accept-encoding": "gzip, deflate",
    //     Referer: "https://www.tiktok.com/",
    //     "user-agent": navigator["user_agent"],
    //     "x-tt-params": signature["x-tt-params"],
    //   },
    // });
    // if (data.status_code !== 0) return console.log("Server Error");
    // RESPONSE.message = "Successfully get items";
    // RESPONSE.error = false;
    // RESPONSE.date = new Date().getDate();
    // data.items.map(async (res) => {
    //   const getURLnoWm = await getUrlNoWm(res.video.id);

    //   const resp = {
    //     video_id: res.video.id,
    //     region: "ID",
    //     title: res.desc,
    //     cover: res.video.cover,
    //     origin_cover: res.video.dynamicCover,
    //     duration: res.video.duration,
    //     play: getURLnoWm,
    //     music_info: {
    //       id: res.music.id,
    //       title: res.music.title,
    //       play: res.music.playUrl,
    //       cover: res.music.coverLarge,
    //       author: res.music.authorName,
    //       original: res.music.original,
    //       duration: res.music.duration,
    //       album: res.music.album,
    //     },
    //     play_count: res.stats.playCount,
    //     digg_count: res.stats.diggCount,
    //     comment_count: res.stats.commentCount,
    //     share_count: res.stats.shareCount,
    //     create_time: res.createTime,
    //     author: {
    //       id: res.author.id,
    //       unique_id: res.author.uniqueId,
    //       nickname: res.author.nickname,
    //       avatar: res.author.avatarLarger,
    //     },
    //   };
    //   await RESPONSE.data.push(resp);
    //   await console.log(RESPONSE);
    // });
    // // console.log(signature.signed_url);

    // const tikUser = await signer.sign("https://www.tiktok.com/@nesyaaast");
    // const navigator = await signer.navigator();
    // const cookieJar = rp.jar();
    console.log("Getting Cookies");
    const getCok = await request.get(
      "https://www.tiktok.com",
      function (err, response, body) {
        var rawcookies = response.headers["set-cookie"];
        console.log(rawcookies);
      }
    );
    // const getCok = await axios({
    //   method: "get",
    //   url: "https://www.tiktok.com",
    //   headers: {
    //     Accept:
    //       "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    //     "Accept-Encoding": "gzip, deflate",
    //     "accept-language": "id,en-US;q=0.9,en;q=0.8",
    //     "user-agent":
    //       "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    //   },
    // });
    // const cookies = getCok.headers["set-cookie"];
    // console.log("Success getting Cookies : ");
    // cookies.map((res) => {
    //   console.log(cookies);
    // });
    // const req = await axios({
    //   method: "get",
    //   url: "https://www.tiktok.com/@nesyaaast?lang=id-ID",
    //   headers: {
    //     Accept:
    //       "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    //     path: "/@nesyaaast",
    //     "Accept-Encoding": "gzip, deflate",
    //     "accept-language": "id,en-US;q=0.9,en;q=0.8",
    //     Connection: "keep-alive",
    //     "user-agent":
    //       "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    //     Cookie: cookies,
    //     Referrer: "https://www.tiktok.com/",
    //   },
    //   withCredentials: true,
    // });
    // const $ = Cheerio.load(req.data);
    // console.log(req.data);
  } catch (err) {
    console.log(err);
  }
};
main();
