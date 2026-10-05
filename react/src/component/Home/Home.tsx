import React, { FC, useEffect } from 'react';
import './Home.scss';
import { Outlet, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';

interface HomeProps { }

const Home: FC<HomeProps> = () => {
  const location = useLocation();
 const dispatch = useDispatch();

//  useEffect(()=>{
//    let token= sessionStorage.getItem('my-token');
//    if(!token){
//     navigate('/Login')
//    }
//   },[])
useEffect(() => {
  const token = sessionStorage.getItem('my-token');
  const userData = sessionStorage.getItem('user-data');

  if (!token || !userData) {
   // navigate('/Login');
  } else {
    dispatch(setUser(JSON.parse(userData)));
  }
}, []);
  const showVideo = location.pathname === '/Home' || location.pathname === '/Home/About';

  return (
    <div className="Home">
      {showVideo && (
        <video className="background-video" autoPlay muted loop>
          <source src="/videos/winery.mp4" type="video/mp4" />
        </video>
      )}

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
