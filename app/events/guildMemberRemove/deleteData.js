const userAccount = require("../../schemas/userAccount");
const userTicket = require("../../schemas/userTicket");

module.exports = async (client, member) => {

    await userAccount.deleteOne({ userId: member.user.id });
    await userTicket.deleteOne({ userId: member.user.id });
}