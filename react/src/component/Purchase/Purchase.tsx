import React, { FC, useEffect } from 'react';
import './Purchase.scss';
import { useNavigate } from 'react-router-dom';

interface PurchaseProps {}

const Purchase: FC<PurchaseProps> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/Home/About');
    }, 3000);

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div className="Purchase">
      <div className="card">
        <h2>🎉 הקנייה נקלטה בהצלחה!</h2>
        <p>📦 המשלוח בדרך אליך</p>
        <p>💖 תודה שקניתם אצלנו</p>
      </div>
    </div>
  );
};

export default Purchase;
