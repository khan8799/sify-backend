const mongoose = require("mongoose");

const Service = require("./../service/Appointment");

const selectFields = 'newsId user author description location tests instructions bookingDate timeSlot slip galleryFile isActive createdAt isDeleted';
const addFields = ['user', 'bookingDate', 'location', 'description', 'tests', 'instructions', 'timeSlot', 'slip', 'galleryFile'];

exports.list = async (request, response, next) => {
  try {
    const filter = {user: request.tokens.user._id};
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
      message: "Appointment created",
      payload: result,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error, message: "Internal error." });
  }
};

