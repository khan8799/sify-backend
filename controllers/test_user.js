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
            ...request.body
        }
        const result = await Service.add(userData);
        
        return response
                .status(200)
                .json({
                    title: "Good Job",
                    description: 'Account created successfully',
                    payload: result
                });
    } catch (error) {
        console.log(error);
        return response.status(500).json({title: "OOPS!!!", description: 'Something went wrong, please try again later.'});
    }
  
};



