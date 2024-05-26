/* eslint-disable */
import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';


const MainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current location is ', location);
  }, [location]);

  return (
    <>
      <nav>
        <ul>
          <li>
            <button onClick={() => navigate('login', { replace: false })}>
              Hexlet Chat
            </button>
          </li>
          <li>
            <button onClick={() => navigate('two', { replace: false })}>
              Page Two
            </button>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </>
  )
};

export default MainPage;