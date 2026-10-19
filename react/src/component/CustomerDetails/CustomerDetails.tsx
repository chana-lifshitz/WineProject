import React, { FC, useState } from 'react';
import './CustomerDetails.scss';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { updateCustomer } from '../../service/wines';
import { showMessage } from '../../redux/messageSlice';

interface CustomerDetailsProps {}

const CustomerDetails: FC<CustomerDetailsProps> = () => {
  const currentUser = useSelector((store: any) => store.userSlice.currentUser);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState(currentUser?.password || '');

  if (!currentUser) return <p>לא מחובר</p>;

  const handleSave = async () => {
    try {
      const response = await updateCustomer(currentUser.id, name, email, password, currentUser.isAdmin);

      if (response.data.success) {
        dispatch(setUser({
          id: currentUser.id,
          isAdmin: currentUser.isAdmin,
          name,
          email,
          password
        }));

        dispatch(showMessage({
          title: 'הצלחה',
          body: 'הפרטים עודכנו בהצלחה!',
          delay: 3000
        }));
      } else {
        dispatch(showMessage({
          title: 'שגיאה',
          body: 'אירעה שגיאה בשמירה בשרת.',
          delay: 4000
        }));
      }

      setIsEditing(false);
    } catch (error) {
      console.error("שגיאה בעדכון:", error);
      dispatch(showMessage({
        title: 'שגיאה',
        body: 'אירעה שגיאה בעדכון הנתונים.',
        delay: 4000
      }));
    }
  };

  return (
    <div className="CustomerDetails">
      <h2>שלום, {currentUser.name}!</h2>

      <div>
        <h3>פרטים אישיים:</h3>

        {isEditing ? (
          <>
            <p>שם: <input value={name} onChange={e => setName(e.target.value)} /></p>
            <p>אימייל: <input value={email} onChange={e => setEmail(e.target.value)} /></p>
            <p>סיסמה: <input value={password} onChange={e => setPassword(e.target.value)} type="password" /></p>
            <button onClick={handleSave}>שמור</button>
          </>
        ) : (
          <>
            <p>שם: {currentUser.name}</p>
            <p>אימייל: {currentUser.email}</p>
            <p>סיסמה: {currentUser.password}</p>
            <button onClick={() => setIsEditing(true)}>לעדכון הפרטים</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;