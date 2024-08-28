const { model, Schema } = require("mongoose");

let userTicket = new Schema({
  userId: String,
  channelId: String,
  messageId: String,
});

module.exports = model("UserTicket", userTicket);
