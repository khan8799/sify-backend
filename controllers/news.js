const mongoose = require("mongoose");

const Service = require("./../service/News");

const selectFields = 'newsId user author description title content source publishedAt url urlToImage isActive createdAt isDeleted isBookmark';
const addFields = ['user', 'author', 'title', 'description', 'content', 'source', 'publishedAt', 'url', 'urlToImage', 'isBookmark'];

exports.list = async (request, response, next) => {
  try {
    const filter = {user: request.tokens.user._id};
    if (request.query.hasOwnProperty('isBookmark'))
      filter['isBookmark'] = request.query.isBookmark === 'true' ? true : false;

    const option = {sort: { createdAt: -1 }}

    const result = await Service.findAll(filter, selectFields, option);
    return response.status(200).json({ message: "success", payload: result });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." });
  }
};


exports.add = async (request, response, next) => {
  try {
    for (let key in request.body) {
      if (addFields.findIndex((v) => v === key) === -1) {
        console.log(key);
        throw {status: 404, message: 'Bad request'}
      }
    }

    request.body["_id"] = new mongoose.Types.ObjectId();
    const result = await Service.add(request.body);
    return response.status(201).json({
      message: "User created",
      payload: result,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error, message: "Internal error." });
  }
};

