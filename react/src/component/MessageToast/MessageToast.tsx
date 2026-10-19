import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-bootstrap/Toast';
import { hideMessage } from '../../redux/messageSlice';
import './MessageToast.scss';



interface MessageToastProps {}

const MessageToast: FC<MessageToastProps> = () =>  {
  const dispatch = useDispatch();
  const { show, title, body, delay } = useSelector((state:any) => state.messageSlice);
  // הסתרה אוטומטית
  React.useEffect(() => {
    if (show && delay) {
      const timeout = setTimeout(() => {
        dispatch(hideMessage());
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [show, delay, dispatch]);

  if (!show) return null;

  return (
    <div className="custom-toast">
      <div className="custom-toast-header">
        <button onClick={() => dispatch(hideMessage())}>×</button>
        <strong>{title}</strong>   
      </div>
      <div className="custom-toast-body">{body}</div>
    </div>
  );

};

export default MessageToast;