const mongoose = require("mongoose");
const dotenv = require("dotenv");
process.on("uncaughtException", (err) => {
  console.log(err.name, " ", err.message);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });
const app = require("./app");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then((con) => {
  console.log("DB connection successful");
});
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`app is listening at ${PORT}.........`);
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLER REJECION! shutting down......");
  server.close(() => {
    process.exit(1);
  });
});
