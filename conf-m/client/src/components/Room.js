import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Room({ room, date, timeRange }) {
  // Function to check if a room is booked for the given date and time range
  const isBooked = () => {
    const startTime = timeRange[0];
    const endTime = timeRange[1];
    
    // Check if any booking overlaps with the selected date and time range
    for (const booking of room.currentbookings) {
      if (
        booking.date === date &&
        (
          (startTime >= booking.starttime && startTime < booking.endtime) ||
          (endTime > booking.starttime && endTime <= booking.endtime) ||
          (startTime <= booking.starttime && endTime >= booking.endtime)
        )
      ) {
        return true; // Room is booked
      }
    }
    return false; // Room is available
  };

  return (
    <div className={`d-flex justify-content-center align-items-center row bs text-center ${isBooked() ? 'room-booked' : ''}`}>
      <div className="col-md-12">
        <h1 style={{ fontWeight: "bold" }}>{room.name}</h1>
        <div style={{ textAlign: "center", fontWeight: "bold" }}>
          <p>Max Count: {room.maxcount}</p>
          <p>Phone Number: {room.phonenumber}</p>
        </div>
        {isBooked() && (
          <div className="text-danger">Already booked for {date} try for different time range. </div>
        )}
        <div>
          {date && timeRange.length === 2 && (
            <Link to={`/book/${room._id}/${date}/${timeRange[0]}/${timeRange[1]}`}>
              <Button className="btn btn-primary m-2">Book Now</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Room;
