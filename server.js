const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 7000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});


process.on("warning", (e) => console.warn(e.stack));
process.on("error", (e) => console.error(e.stack));

// app.listen(PORT, () => {
//     console.log(`Listening on port ${PORT}...`);
// });
