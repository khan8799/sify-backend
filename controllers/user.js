const mongoose = require("mongoose");

const AdminModel = require("../models/user");

const md5 = require("md5");
const jwt = require("jsonwebtoken");

const Service = require("../service/User");

const selectFields =
  "payment firstName lastName displayName email contact gender isActive createdAt isDeleted";
const addFields = [
  "firstName",
  "lastName",
  "displayName",
  "email",
  "contact",
  "password",
  "gender",
];
const updateFields = [
  "firstName",
  "lastName",
  "email",
  "isActive",
  "isDeleted",
];


exports.getBasicinfo = (request, response, next) => {
  const adminDetails = request.tokens.user;
  const filter = { _id: adminDetails._id };
  const populate = [{
    path: 'payment',
    select: 'orderId'
  }]

  AdminModel.findOne(filter)
    .populate(populate)
    .select(selectFields)
    .exec()
    .then((user) => {
      if (!user)
        return response.status(401).json({ message: "User not found." });

      return response.status(200).json({
        message: "User Detail",
        payload: user,
      });
    })
    .catch((error) =>
      response.status(500).json({ error, message: "Error in finding detail." })
    );
};


exports.login = (request, response, next) => {
  const password = md5(request.body.password);

  const filter = {
    email: request.body.email,
    password,
  };

  AdminModel.findOne(filter)
    .select(selectFields)
    .then((user) => {
      console.log(user);
      if (!user)
        return response.status(401).json({ message: "Authentication failed." });
      
      const userData = user.toObject(); // Can't modify mongoose doc, hence converting to plain object

      const token = jwt.sign(
        {
          user: userData,
        },
        "sfv@#!cgsaq!$#@ogtrbvso",
        // process.env.SECRET_KEY,
        {
          expiresIn: "12h",
        }
      );

      return response.status(200).json({
        message: "Authentication successful.",
        token: token,
        user: userData,
      });
    })
    .catch((error) =>
      response.status(500).json({ error, message: "Internal Error." })
    );
};


exports.list = async (request, response, next) => {
  try {
    const totalRecords = await Service.findAll();
    const result = await Service.findAll(
      {},
      selectFields,
    );
    return response
      .status(200)
      .json({
        message: "success",
        payload: result,
        totalRecords: totalRecords.length,
      });
  } catch (error) {
    return response.status(500).json({ error, message: "Internal error." });
  }
};

/*
| Add admin user 
*/
exports.addUser = async (request, response, next) => {
  try {
    for (let key in request.body) {
      if (addFields.findIndex((v) => v === key) === -1)
        throw {status: 404, message: 'Bad request'}
    }

    const exist = await Service.findOne(
      { email: request.body.email },
      "_id"
    );
    if (exist)
      throw {status: 409, message: 'Already exist'}

    request.body["_id"] = new mongoose.Types.ObjectId();
    request.body["password"] = md5(request.body.password);

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


exports.editUser = async (request, response, next) => {
  try {
    for (let key in request.body) {
      if (updateFields.findIndex((v) => v === key) === -1) {
        return response
          .status(400)
          .json({ message: 'Bad request' });
      }
    }
    
    const filter = { _id: request.query._id };
    const exist = await Service.findOne(filter, "_id");
    if (!exist)
      return response
        .status(404)
        .json({ message: 'Not found' });

    const emailFilter = {
      _id: { $ne: request.query._id },
      email: request.body.email,
    };
    const emailExist = await Service.findOne(emailFilter, "_id");
    if (emailExist)
      return response
        .status(409)
        .json({ message: 'Already exist' });

    request.body["updatedBy"] = request.tokens.user._id;
    const payload = await Service.updateOne(filter, request.body);
    return response.status(200).json({ message: 'Updated', payload });
  } catch (error) {
    return response.status(500).json({ error, message: "Internal error." });
  }
};



