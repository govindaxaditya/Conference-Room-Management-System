import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from 'sweetalert2';

const { TabPane } = Tabs;

// Adminscreen Component
function Adminscreen() {
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("currentUser")).isAdmin) {
      window.location.href = "/home";
    }
  }, []);

  return (
    <div className="mt-3 ml-3 mr-3 bs">
      <h1>Admin Panel</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bookings" key="1">
          <Bookings />
        </TabPane>
        <TabPane tab="Rooms" key="2">
          <Rooms />
        </TabPane>
        <TabPane tab="Add Room" key="3">
          <Addroom />
        </TabPane>
        <TabPane tab="Users" key="4">
          <Users />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Adminscreen;

// Booking List Component
export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBookingsAndUsers = async () => {
      try {
        const [bookingsResponse, usersResponse] = await Promise.all([
          axios.get("/api/bookings/getallbookings"),
          axios.get("/api/users/getallusers"),
        ]);

        setBookings(bookingsResponse.data);
        setUsers(usersResponse.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    };

    fetchBookingsAndUsers();
  }, []);

  const getUserName = (userId) => {
    const user = users.find(user => user._id === userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-10 text-center">
        <h1>Bookings</h1>
        {loading && <Loader />}
        {error && <Error />}

        <table className="table table-bordered table-dark">
          <thead className="bs thead-dark">
            <tr>
              <th>Booking Id</th>
              <th>User Name</th>
              <th>Room</th>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !error && bookings.length > 0 && bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>{getUserName(booking.userid)}</td>
                <td>{booking.room}</td>
                <td>{booking.date}</td>
                <td>{booking.starttime}</td>
                <td>{booking.endtime}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Rooms List Component
export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get("/api/rooms/getallrooms");
        setRooms(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    };

    fetchRooms();

    return () => {
      // Clean up function if needed
    };
  }, []);

  
  const deleteRoom = async (roomId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/rooms/deleteroom/${roomId}`);
      setLoading(false);
      Swal.fire('Deleted!', 'The room has been deleted.', 'success');
      setRooms(rooms.filter(room => room._id !== roomId));
    } catch (error) {
      console.error('Error deleting room:', error);
      setLoading(false);
      Swal.fire('Oops', 'Something went wrong', 'error');
    }
  };

  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-10 text-center">
        <h1>Rooms</h1>
        {loading && <Loader />}
        {error && <Error />}

        <table className="table table-bordered table-dark">
          <thead className="bs thead-dark">
          <tr>
              <th>Room Id</th>
              <th>Name</th>
              <th>Rent Per Hour</th>
              <th>Max Count</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {!loading && !error && rooms.length > 0 && rooms.map((room) => (
              <tr key={room._id}>
                <td>{room._id}</td>
                <td>{room.name}</td>
                <td>{room.rentperday}</td>
                <td>{room.maxcount}</td>
                <td>{room.phonenumber}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => deleteRoom(room._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Users List Component
export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/users/getallusers");
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      // Clean up function if needed
    };
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h1> Users</h1>
        {loading && <Loader />}
        <table className="table table-dark table-bordered">
          <thead>
            <tr>
              <th>User Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Is Admin</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "Yes" : "No"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Add Room Component
export function Addroom() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [rentperday, setRentPerDay] = useState('');
  const [maxcount, setMaxCount] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');

  const addRoom = async () => {
    const newRoom = {
      name,
      rentperday,
      maxcount,
      phonenumber,
    };

    try {
      setLoading(true);
      const result = await axios.post('/api/rooms/addroom', newRoom);
      console.log(result);
      setLoading(false);
      Swal.fire('Congratulations', 'Your Room Added Successfully', 'success').then(result => {
        window.location.href = '/admin';
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire('Oops', 'Something went wrong', 'error');
    }

    console.log(newRoom);
  };


  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-5">
        {loading && <Loader />}
        <input
          type="text"
          className="form-control"
          placeholder="Room Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Rent Per Hour"
          value={rentperday}
          onChange={(e) => setRentPerDay(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Max Count"
          value={maxcount}
          onChange={(e) => setMaxCount(e.target.value)}
        />
   
        <input
          type="text"
          className="form-control"
          placeholder="Phone Number"
          value={phonenumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={addRoom}>Add Room</button>
      </div>
    </div>
  );
}
