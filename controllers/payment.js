const mongoose = require("mongoose");
const axios = require("axios");
const base64 = require("base-64"); 

const Service = require("./../service/Payment");
const UserService = require("./../service/User");

const selectFields = 'orderId entity amount amountPaid amountDue currency receipt offerId status attempts notes isActive createdAtTimestamp isDeleted';
const addFields = ['user', 'orderId', 'entity', 'amount', 'amount_paid', 'amount_due', 'currency', 'offer_id', 'status', 'attempts', 'notes', 'created_at'];

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


exports.createOrderId = async (request, response, next) => {
  try {
    const createOrderIdData = {
      amount: request.body.amount,
      currency: 'INR',
      receipt: 'receipt_112'
    }

    const orderResponse = await makeRequest('POST', 'orders', null, createOrderIdData);
    console.log(orderResponse);
    
    const createOrder = {
      _id: new mongoose.Types.ObjectId(),
      user: request.tokens.user._id,
      orderId: orderResponse.id,
      amount: orderResponse.amount,
      amountPaid: orderResponse.amount_paid,
      amountDue: orderResponse.amount_due,
      currency: orderResponse.currency,
      receipt: orderResponse.receipt,
      offerId: orderResponse.offer_id,
      status: orderResponse.status,
      attempts: orderResponse.attempts,
      notes: orderResponse.notes,
      createdAt: orderResponse.created_at,
    }

    const result = await Service.add(createOrder);

    const userFilter = {_id: request.tokens.user._id};
    const userData = {payment: result._id};
    UserService.updateOne(userFilter, userData).then(res => console.log('User updated'));

    return response.status(201).json({
      message: "Order ID Created",
      payload: result,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error, message: "Internal error." });
  }
};

exports.verifyPaymentSignature = async (request, response, next) => {
  try {
    const paymentFilter = {_id: request.query._id}
    const paymentResponse = {
      razorpayPaymentId: request.body.razorpay_payment_id,
      razorpayOrderId: request.body.razorpay_order_id,
      razorpaySignature: request.body.razorpay_signature,
    }

    const result = await Service.updateOne(paymentFilter, paymentResponse);

    return response.status(200).json({
      message: "Payment successful.",
      payload: result,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error, message: "Internal error." });
  }
};

async function makeRequest(method, url, params = null, data = null) {
  try {
    const config = getConfig(method, url, params, data)
    const result = await axios(config);
    console.log({status: result.status});
    console.log({response: result.data});
    return result.data;
  } catch (error) {
    handleError(error);
    throw {
      status: error.status || error.response.status,
      message: error.message || error.response.data.message,
    };
  }
}

function getConfig(method, url, params = null, data = null) {
  const token = `${process.env.RAZORPAY_API_KEY}:${process.env.RAZORPAY_SECRET_KEY}`;
  const encodedToken = base64.encode(token);
  
  let config = {
    baseURL: process.env.RAZORPAY_API_URL,
    url,
    method,
    params,
    responseType: "json",
    headers: {
      Authorization: `Basic ${encodedToken}`
    }
  };

  switch (method) {
    case "GET":
      break;

    case "POST":
    case "PUT":
      config["data"] = data;
      break;
  }

  return config;
}

function handleError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
}
