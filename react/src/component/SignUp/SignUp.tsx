
import React, { FC } from 'react';
import './SignUp.scss';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AddCustomer } from '../../service/wines';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { showMessage } from '../../redux/messageSlice';

interface SignUpProps {}

const SignUp: FC<SignUpProps> = () => {
  const myNavigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const state = location.state as { email?: string; password?: string } || {};

  const save = async (values: any) => {
    try {
      const response = await AddCustomer(values.name, values.email, values.password);

      sessionStorage.setItem('my-token', response.data.id);
      sessionStorage.setItem('user-data', JSON.stringify(response.data));
      dispatch(setUser(response.data));

      dispatch(showMessage({
        title: 'הצלחה',
        body: 'הלקוח נוסף בהצלחה!',
        delay: 3000
      }));

      setTimeout(() => {
        myNavigate('/Home');
      }, 2000);

    } catch (error) {
      dispatch(showMessage({
        title: 'שגיאה',
        body: 'שגיאה בהוספת הלקוח, נסה שנית.',
        delay: 3000
      }));
    }
  };

  const generateStrongPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  };

  const myForm = useFormik({
    initialValues: {
      name: '',
      email: state.email || '',
      password: state.password || ''
    },
    onSubmit: save,
    validationSchema: yup.object().shape({
      name: yup.string().required('שדה חובה'),
      email: yup.string().email('כתובת אימייל שגויה').required('שדה חובה'),
      password: yup
        .string()
        .required('שדה חובה')
        .test('strong-password', 'הסיסמה חלשה מדי', (value) => {
          if (!value) return false;
          return (
            value.length >= 8 &&
            /[A-Z]/.test(value) &&
            /\d/.test(value) &&
            /[!@#$%^&*]/.test(value)
          );
        }),
    }),
  });

  return (
    <div className="SignUp">
      <form onSubmit={myForm.handleSubmit} className="login-form-container">
        <h2>הרשמה</h2>

        <input
          name="name"
          type="text"
          placeholder="שם מלא"
          value={myForm.values.name}
          onChange={myForm.handleChange}
          onBlur={myForm.handleBlur}
        />
        {myForm.touched.name && myForm.errors.name && (
          <div className="error">{myForm.errors.name}</div>
        )}

        <input
          name="email"
          type="email"
          placeholder="אימייל"
          value={myForm.values.email}
          onChange={myForm.handleChange}
          onBlur={myForm.handleBlur}
        />
        {myForm.touched.email && myForm.errors.email && (
          <div className="error">{myForm.errors.email}</div>
        )}

        <input
          name="password"
          type="password"
          placeholder="סיסמה"
          value={myForm.values.password}
          onChange={myForm.handleChange}
          onBlur={myForm.handleBlur}
        />
        {myForm.touched.password && myForm.errors.password && (
          <div className="error">{myForm.errors.password}</div>
        )}

        <button
          type="button"
          className="suggest-password"
          onClick={() =>
            myForm.setFieldValue('password', generateStrongPassword())
          }
        >
          הצע לי סיסמה חזקה
        </button>

        <button type="submit">התחברי</button>
      </form>
    </div>
  );
};

export default SignUp;
