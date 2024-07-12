import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import Swal from 'sweetalert2';

function Bookingscreen() {
  const { roomid, date, starttime, endtime } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);
  const [totalamount, setTotalAmount] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const checkBooking = async () => {
      try {
        const response = await axios.post('/api/bookings/checkbooking', { roomid, date, starttime, endtime });
        if (response.data.exists) {
          Swal.fire('Error', 'This booking already exists. Redirecting to your homepage.', 'error').then(() => {
            navigate('/home');
          });
        } else {
          fetchRoomData();
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    const fetchRoomData = async () => {
      try {
        const { data } = await axios.post("/api/rooms/getroombyid", { roomid });

        const start = moment(`${date} ${starttime}`, "DD-MM-YYYY HH:mm");
        const end = moment(`${date} ${endtime}`, "DD-MM-YYYY HH:mm");
        const hoursDiff = moment.duration(end.diff(start)).asHours();
        const calculatedAmount = hoursDiff * 100;

        setHours(hoursDiff);
        setTotalAmount(calculatedAmount);
        setRoom(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };

    if (!localStorage.getItem('currentUser')) {
      navigate('/login');
    } else {
      checkBooking();
    }

    const handlePopState = () => {
      navigate('/home');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [roomid, date, starttime, endtime, navigate]);

  if (loading) return <Loader />;
  if (error) return <div className="mt-5"><Error /></div>;
  if (!room) return null;

  async function bookRoom() {
    const bookingDetails = {
      room,
      roomid: room._id,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      date,
      starttime,
      endtime,
      totalamount,
    };

    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setLoading(false);
      if (result.status === 200) {
        Swal.fire('Congratulations!', 'Your Room Booked Successfully', 'success').then(() => {
          navigate('/profile');
        });
      } else {
        Swal.fire('Oops!', 'Something went wrong', 'error');
      }
    } catch (error) {
      setLoading(false);
      Swal.fire('Oops!', 'Something went wrong', 'error');
    }
  }

  function handleBookNow() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to book this room for the selected time slot?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, book it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        bookRoom();
      }
    });
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-8">
          <div className="text-center">
            <h2>{room.name}</h2>
          </div>
          <div className="bs">
            <div className="text-center">
              <h1>Booking Details</h1>
              <hr />
              <b>
                <p>Name: {JSON.parse(localStorage.getItem("currentUser")).name}</p>
                <p>Date: {date}</p>
                <p>Start Time: {starttime}</p>
                <p>End Time: {endtime}</p>
                <p>Max Count: {room.maxcount}</p>
              </b>
            </div>
            <div className="text-center">
              <b>
                <h1>Amount</h1>
                <hr />
                <p>Total hours: {hours}</p>
                <p>Rent per hour: $100</p>
                <p>Total Amount: ${totalamount}</p>
              </b>
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-primary" onClick={handleBookNow}>Book Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookingscreen;
