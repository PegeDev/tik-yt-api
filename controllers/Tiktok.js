const router = require("express").Router();
const axios = require("axios");
const fs = require("fs");
const storeTrend = require("../public/data.json");
const path = require("path");
const Signer = require("tiktok-signature");

const TREND_ENDPOINT = "https://www.tiktok.com/api/item_list/";
const SEC_UID =
  "MS4wLjABAAAAtmJlKyddZ0L32G1z-Bl165iS2hMrkK6OPuENajdPDWtaPEF-5m-NbedmyA-Zz2fD";
const FYP_ENDPOINT =
  "https://www.tiktok.com/foryou?is_copy_url=1&is_from_webapp=v1";

const CURSOR = {
  minCursor: 0,
  maxCursor: 0,
};
let COUNT = 10;

const TREND_PARAMS = {
  aid: 1988,
  count: COUNT,
  referer: FYP_ENDPOINT,
  referer_host: "www.tiktok.com",
  cookieEnabled: true,
  device_id: "7178918667915609601",
  device_platform: "web_pc",
  sourceType: 12,
  verifyFp: "",
  secUid: SEC_UID,
  app_name: "tiktok_web",
  device_platform: "web",
  minCursor: CURSOR.minCursor,
  maxCursor: CURSOR.maxCursor,
  resolution: "1920x1080",
  screen_height: 1080,
  screen_width: 1920,
  height: 1080,
  width: 1920,
  lang: "id",
  region: "ID",
  language: "id",
};
const RESPONSE = {
  date: "",
  error: "",
  message: "",
  hasMore: "",
  cursor: "",
  userInfo: {
    stats: {},
  },
  data: [],
};

const getUrlNoWm = async (videoKey) => {
  const response = await axios({
    url: `https://api16-normal-useast5.us.tiktokv.com/aweme/v1/aweme/detail/?aweme_id=${videoKey}&improve_bitrate=1&mediaType=4`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "*",
    },
  });
  return response.data.aweme_detail.video.play_addr.url_list[0];
};

const main = async (cursor, count) => {
  try {
    COUNT = count;
    CURSOR.minCursor = cursor;
    CURSOR.maxCursor = cursor;
    const qsObj = new URLSearchParams(TREND_PARAMS);
    const qs = qsObj.toString();
    const signer = new Signer();
    await signer.init();

    const signature = await signer.sign(`${TREND_ENDPOINT}?${qs}`);
    const navigator = await signer.navigator();
    await signer.close();
    // GET COOKIES
    const getCok = await axios.head(FYP_ENDPOINT, { withCredentials: true });

    const { data } = await axios({
      url: signature.signed_url,
      method: "get",
      headers: {
        Cookie: getCok.headers["set-cookie"],
        // ttwid: ttwid,
        "accept-encoding": "gzip, deflate",
        Referer: FYP_ENDPOINT,
        "user-agent": navigator["user_agent"],
        "x-tt-params": signature["x-tt-params"],
      },
      withCredentials: true,
    });
    if (data.status_code !== 0) return console.log("Server Error");
    // const date = new Date();
    RESPONSE.message = "Successfully get items";
    RESPONSE.error = false;
    RESPONSE.hasMore = data.hasMore;
    RESPONSE.cursor = data.maxCursor;
    RESPONSE.date = Date.now();
    const tempData = [];
    for (let res of data.items) {
      const getUrl = await getUrlNoWm(res.video.id);
      await tempData.push({
        video_id: res.video.id,
        region: "ID",
        title: res.desc,
        cover: res.video.dynamicCover,
        origin_cover: res.video.cover,
        duration: res.video.duration,
        play: getUrl,
        music_info: {
          id: res.music.id,
          title: res.music.title,
          play: res.music.playUrl,
          cover: res.music.coverLarge,
          author: res.music.authorName,
          original: res.music.original,
          duration: res.music.duration,
          album: res.music.album,
        },
        play_count: res.stats.playCount,
        digg_count: res.stats.diggCount,
        comment_count: res.stats.commentCount,
        share_count: res.stats.shareCount,
        create_time: res.createTime,
        author: {
          id: res.author.id,
          unique_id: res.author.uniqueId,
          nickname: res.author.nickname,
          avatar: res.author.avatarLarger,
        },
      });
    }

    RESPONSE.data = await tempData;
    return RESPONSE;
    // console.log(signature.signed_url);
  } catch (err) {
    console.log(err);
  }
};

const getTrending = async (req, res) => {
  try {
    const { cursor, count } = req.query;

    await main(cursor, count).then((el) => {
      res.status(200).json(el);
    });
  } catch (err) {
    console.log(err);
  }
};
const getUser = async (req, res) => {
  const { userId, count, cursor } = req.query;
  try {
    if (!userId)
      return res.json({ msg: "Parameter tidak sesuai!", error: true });
    const getUserInfo = async (userId) => {
      const { data } = await axios({
        url: "https://www.tikwm.com/api/user/info",
        method: "GET",
        params: {
          unique_id: userId,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept-Encoding": "*",
        },
      });
      return data.data;
    };
    const dataUsers = await getUserInfo(userId);
    const unsigned = "https://www.tiktok.com/api/item_list/";
    const USERS_QUERY = {
      aid: 1988,
      app_name: "tiktok_web",
      device_platform: "web",
      referer: FYP_ENDPOINT,
      cookie_enabled: true,
      did: "",
      count: count,
      id: dataUsers.user.id,
      type: 1,
      secUid: SEC_UID,
      maxCursor: cursor,
      minCursor: 0,
      sourceType: 8,
      appId: 1233,
      region: "ID",
      language: "id",
    };
    const signer = new Signer();
    await signer.init();

    const paramsObj = new URLSearchParams(USERS_QUERY);
    const params = await paramsObj.toString();

    const signature = await signer.sign(`${unsigned}?${params}`);
    const navigator = await signer.navigator();

    // GET COOKIES FROM FYP PAGE
    const getCok = await axios.head(FYP_ENDPOINT, { withCredentials: true });
    const { data } = await axios({
      url: signature.signed_url,
      method: "get",

      headers: {
        Cookie: getCok.headers["set-cookie"],
        "accept-encoding": "gzip, deflate",
        Referer: FYP_ENDPOINT,
        "user-agent": navigator["user_agent"],
        "x-tt-params": signature["x-tt-params"],
      },

      withCredentials: true,
    });
    if (data.status_code !== 0) return console.log("Server Error");
    // const date = new Date();
    RESPONSE.userInfo = await dataUsers.user;
    RESPONSE.userInfo.stats = await dataUsers.stats;
    RESPONSE.message = "Successfully get items";
    RESPONSE.error = false;
    RESPONSE.hasMore = data.hasMore;
    RESPONSE.cursor = data.maxCursor;
    RESPONSE.date = Date.now();
    const tempData = [];
    if (data.items) {
      for (let res of data.items) {
        const getUrl = await getUrlNoWm(res.video.id);
        await tempData.push({
          video_id: res.video.id,
          region: "ID",
          title: res.desc,
          cover: res.video.dynamicCover,
          origin_cover: res.video.cover,
          duration: res.video.duration,
          play: getUrl,
          music_info: {
            id: res.music.id,
            title: res.music.title,
            play: res.music.playUrl,
            cover: res.music.coverLarge,
            author: res.music.authorName,
            original: res.music.original,
            duration: res.music.duration,
            album: res.music.album,
          },
          play_count: res.stats.playCount,
          digg_count: res.stats.diggCount,
          comment_count: res.stats.commentCount,
          share_count: res.stats.shareCount,
          create_time: res.createTime,
          author: {
            id: res.author.id,
            unique_id: res.author.uniqueId,
            nickname: res.author.nickname,
            avatar: res.author.avatarLarger,
          },
        });
      }
    }

    RESPONSE.data = await tempData;
    res.json(RESPONSE);
  } catch (err) {
    res.status(500).json({ msg: "Terjadi Masalah pada server", error: true });
  }
};

module.exports = { getTrending, getUser };
