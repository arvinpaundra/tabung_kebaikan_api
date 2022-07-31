const axios = require('axios').default;

const accessToken = process.env.ACCESS_TOKEN;
const senderPhoneNumberId = process.env.SENDER_PHONE_NUMBER_ID;

module.exports = {
  formatPhoneNumber: (number) => {
    let formatted = number.replace(/\D/g, '');

    if (formatted.startsWith('0')) {
      formatted = `62${formatted.substr(1)}`;
    }

    return formatted;
  },
  fetchAssitant: async ({ recipientNumber, body }) => {
    return await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v13.0/${senderPhoneNumberId}/messages?access_token=${accessToken}`,
      data: {
        messaging_product: 'whatsapp',
        to: recipientNumber,
        text: {
          body: body,
        },
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).catch((error) => console.log(error.message));
  },
};
