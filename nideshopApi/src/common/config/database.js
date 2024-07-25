const mysql = require("think-model-mysql");

module.exports = {
  handle: mysql,
  database: "nideshop",
  prefix: "nideshop_",
  encoding: "utf8mb4",
  host: "107.172.108.5",
  port: "3306",
  user: "think_nideshop",
  password: "think12345678",
  dateStrings: true
};
