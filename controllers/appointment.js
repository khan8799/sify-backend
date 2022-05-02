const mongoose = require("mongoose");

const Service = require("./../service/Appointment");
const CommonHelper = require("./../utils/Common");

const selectFields = 'user isPickUp reference address location tests instructions bookingDate timeSlot slips isActive createdAt isDeleted';
const addFields = ['user', 'isPickUp', 'bookingDate', 'location', 'description', 'tests', 'instructions', 'timeSlot', 'slips', 'address'];

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

    const totalAppointments = await Service.findAll({}, "_id");

    request.body["_id"] = new mongoose.Types.ObjectId();
    request.body["user"] = request.tokens.user._id;
    request.body["reference"] = 'appointment_' + CommonHelper.pad(totalAppointments.length + 1, 6);

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

