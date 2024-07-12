const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const { v4: uuidv4 } = require("uuid");

// New endpoint to check for existing bookings
router.post("/checkbooking", async (req, res) => {
  const { roomid, date, starttime, endtime } = req.body;

  try {
    const existingBooking = await Booking.findOne({
      roomid,
      date,
      starttime,
      endtime,
    });

    if (existingBooking) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking booking:', error);
    return res.status(400).json({ error: 'Error checking booking' });
  }
});

router.post("/bookroom", async (req, res) => {
  const { roomid, userid, date, starttime, endtime, totalamount } = req.body;

  try {
    // Find the room to validate its existence
    const room = await Room.findOne({ _id: roomid });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const newBooking = new Booking({
      room: room.name, // Assuming 'name' is a valid property of the room
      roomid,
      userid,
      date,
      starttime,
      endtime,
      totalamount,
      transactionId: uuidv4(), // Example, should be generated or provided
    });

    const booking = await newBooking.save();

    // Update current bookings in the room
    room.currentbookings.push({
      bookingid: booking._id,
      date,
      starttime,
      endtime,
      userid,
      status: booking.status,
    });

    await room.save();

    res.status(200).json({ message: "Your room is booked", booking });
  } catch (error) {
    console.error('Error booking room:', error);
    return res.status(400).json({ error: 'Error booking room' });
  }
});

router.post('/getbookingsbyuserid', async (req, res) => {
  const { userid } = req.body;

  try {
    const bookings = await Booking.find({ userid });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting bookings by user ID:', error);
    return res.status(400).json({ error: 'Error getting bookings by user ID' });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;

  try {
    const bookingItem = await Booking.findOne({ _id: bookingid });
    if (!bookingItem) {
      return res.status(404).json({ error: "Booking not found" });
    }

    bookingItem.status = 'cancelled';
    await bookingItem.save();

    const room = await Room.findOne({ _id: roomid });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.currentbookings = room.currentbookings.filter(booking => booking.bookingid.toString() !== bookingid);

    await room.save();
    
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error('Error canceling booking:', error);
    return res.status(400).json({ error: 'Error canceling booking' });
  }
});

router.get("/getallbookings", async(req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting all bookings:', error);
    return res.status(400).json({ error: 'Error getting all bookings' });
  }
});

router.delete("/deleteroom/:id", async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error('Error deleting room:', error);
    return res.status(400).json({ error: 'Error deleting room' });
  }
});


module.exports = router;
