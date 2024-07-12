import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker, TimePicker } from "antd";
import moment from "moment";

function HomeScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [date, setDate] = useState(null);
  const [timeRange, setTimeRange] = useState([]);
  const [duplicateRooms, setDuplicateRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/rooms/getallrooms");
        setRooms(response.data);
        setDuplicateRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  function filterByDate(selectedDate) {
    const formattedDate = selectedDate ? selectedDate.format("DD-MM-YYYY") : null;
    setDate(formattedDate);
    filterRooms(formattedDate, timeRange);
  }

  function filterByTime(selectedTime) {
    const startTime = selectedTime && selectedTime.length === 2 ? selectedTime[0]?.format("HH:mm") : null;
    const endTime = selectedTime && selectedTime.length === 2 ? selectedTime[1]?.format("HH:mm") : null;
    setTimeRange([startTime, endTime]);
    filterRooms(date, [startTime, endTime]);
  }

  function filterRooms(selectedDate, selectedTimeRange) {
    let tempRooms = duplicateRooms;

    if (selectedDate && selectedTimeRange.length === 2) {
      const [startTime, endTime] = selectedTimeRange;
      tempRooms = tempRooms.map(room => {
        let isAvailable = true;
        if (room.currentbookings.length > 0) {
          for (const booking of room.currentbookings) {
            if (
              booking.date === selectedDate &&
              (
                (startTime >= booking.starttime && startTime < booking.endtime) ||
                (endTime > booking.starttime && endTime <= booking.endtime) ||
                (startTime <= booking.starttime && endTime >= booking.endtime)
              )
            ) {
              isAvailable = false;
              break;
            }
          }
        }
        return { ...room, available: isAvailable };
      });
    }

    setRooms(tempRooms);
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-6">
          <DatePicker
            format="DD-MM-YYYY"
            onChange={(date) => filterByDate(date)}
            placeholder="Select Date"
            disabledDate={(current) => current && current < moment().startOf('day')}
          />
        </div>
        <div className="col-md-6">
          <TimePicker.RangePicker
            format="HH:mm"
            onChange={(time) => filterByTime(time)}
            placeholder={["Start Time", "End Time"]}
            allowClear={false}
          />
        </div>
      </div>
      
      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : error ? (
          <Error />
        ) : rooms.length === 0 ? (
          <div className="col-md-12 text-center">
            <h2>No rooms available for selected date and time range.</h2>
          </div>
        ) : (
          rooms.map(room => (
            <div className="col-md-9 mt-2" key={room._id}>
              <Room room={room} date={date} timeRange={timeRange} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
