    const express = require("express");

    const app = express();

    const dbConfig = require('./db')

    const roomsRoute = require('./routes/roomRoute')

    const usersRoute = require('./routes/userRoute')

    const bookingsRoute = require('./routes/bookingsRoute')

    
    
    app.use(express.json())

    app.use('/api/rooms', roomsRoute)

    app.use('/api/users' , usersRoute)

    app.use('/api/bookings',bookingsRoute)

    const port = process.env.PORT || 5000;

    app.listen(port, () => console.log(`Node Server Started`));