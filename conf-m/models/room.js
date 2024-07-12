const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  maxcount: {
    type: Number,
    required: true
  },
  phonenumber: {
    type: Number,
    required: true
  },
  rentperday: {
    type: Number,
    required: true
  },
  currentbookings: [
    {
      bookingid: String,
      date: String,
      starttime: String,
      endtime: String,
      userid: String,
      status: String
    }
  ]
}, {
  timestamps: true,
});

const roomModel = mongoose.model('rooms', roomSchema);

module.exports = roomModel;
    