export default async function handler(req, res) {
  const { body } = req;
  return res.send(`Hello ${body.name}, you just parsed the request body!`);
}

const app = require('express')();

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  return res.send(`Hello, you just parsed the request body!`);
});

module.exports = app;