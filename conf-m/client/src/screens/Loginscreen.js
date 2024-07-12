import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';

function Loginscreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function login() {
    const user = {
      email,
      password,
    };

    try {
      setLoading(true);
      const result = (await axios.post('/api/users/login', user)).data;
      setLoading(false);

      if (result.isAdmin) {
        localStorage.setItem('currentUser', JSON.stringify(result));
        window.location.href = '/admin'; // Redirect to admin page
      } else {
        localStorage.setItem('currentUser', JSON.stringify(result));
        window.location.href = '/home'; // Redirect to home page
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  }

  return (
    <div>
      {loading && <Loader />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {error && <Error message="Invalid Credentials" />}
          <div className="bs">
            <h1>Login</h1>
            <input
              type="text"
              className="form-control"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary mt-3" onClick={login}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginscreen;
