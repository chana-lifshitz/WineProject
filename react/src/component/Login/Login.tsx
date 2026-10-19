import React, { FC } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleCustomerLogin } from '../../service/wines';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { showMessage } from '../../redux/messageSlice';

interface LoginProps { }

const Login: FC<LoginProps> = () => {
  const myNavigate = useNavigate();
  const dispatch = useDispatch();
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const loginWithGoogle = async (credential?: string) => {
    if (!credential) {
      dispatch(showMessage({
        title: 'התחברות נכשלה',
        body: 'לא ניתן לאמת את חשבון Google.',
      }));
      return;
    }

    try {
      const response = await GoogleCustomerLogin(credential);
      if (response.data.success) {
        sessionStorage.setItem('my-token', String(response.data.id));
        sessionStorage.setItem('user-data', JSON.stringify(response.data));
        dispatch(setUser(response.data));
        myNavigate('/Home/About');
      } else {
        dispatch(showMessage({
          title: 'התחברות נכשלה',
          body: response.data.message || 'לא ניתן להתחבר באמצעות Google.',
        }));
      }
    } catch (error: any) {
      dispatch(showMessage({
        title: 'התחברות נכשלה',
        body: error.response?.data?.message || 'לא ניתן להתחבר באמצעות Google כרגע.',
      }));
    }
  };

  return (
    <div className="Login">
      <div className="login-form-container">
        <h2>התחברות</h2>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={(response) => loginWithGoogle(response.credential)}
              onError={() => loginWithGoogle()}
              locale="he"
              text="signin_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="260"
            />
          </GoogleOAuthProvider>
        ) : (
          <p className="login-config-error">ההתחברות דרך Google עדיין לא הוגדרה.</p>
        )}
      </div>
    </div>
  );
};

export default Login;