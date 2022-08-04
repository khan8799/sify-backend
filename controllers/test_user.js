const mongoose = require("mongoose");

const md5 = require("md5");
const jwt = require("jsonwebtoken");

const Service = require("../service/TestUser");

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

exports.signup = async (request, response, next) => {
  try {
    const userData = {
      displayName: `${request.body.firstName} ${request.body.lastName}`,
      ...request.body,
    };
    const result = await Service.add(userData);

    return response.status(200).json({
      title: "Good Job",
      description: "Account created successfully",
      payload: result,
    });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({
        title: "OOPS!!!",
        description: "Something went wrong, please try again later.",
      });
  }
};

exports.login = async (request, response, next) => {
  try {
    const filter = {
      email: request.body.email,
      password: request.body.password
    };
    
    const result = await Service.findOne(filter);

    const userData = result.toObject(); // Can't modify mongoose doc, hence converting to plain object

    const token = jwt.sign(
      {
        user: userData,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    return response.status(200).json({
      title: "Congratulations!!!",
      description: "Log in successfull",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({
        title: "OOPS!!!",
        description: "Something went wrong, please try again later.",
      });
  }
};
