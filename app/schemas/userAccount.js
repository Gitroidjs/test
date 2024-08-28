const { model, Schema } = require("mongoose");

let userAccount = new Schema({
  userId: String,
  userName: String,
  balance: Number,
  BankBal: Number,
  coolDownExpiration: Number,
  robCooldownExpiration: Number,
});

module.exports = model("userAccount", userAccount);
