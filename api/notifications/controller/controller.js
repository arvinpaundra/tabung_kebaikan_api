const { formatPhoneNumber, fetchAssitant } = require('../../../helper');

module.exports = {
  notifAfterPenarikan: async (req, res) => {
    try {
      const munfiq = req.body.munfiq;
      const nominal = parseInt(req.body.nominal);
      const no_tlp = req.body.no_tlp;

      if (typeof nominal !== 'number') {
        throw new Error('invalid');
      }

      const phoneNumber = formatPhoneNumber(no_tlp);

      await fetchAssitant({
        recipientNumber: phoneNumber,
        body: `Halo ${munfiq}, donasimu sejumlah ${nominal} rupiah telah diterima.`,
      });

      return res.status(200).json({ data: { message: 'success' } });
    } catch (error) {
      return res.sendStatus(500).json({ data: { message: error.message } });
    }
  },
};
