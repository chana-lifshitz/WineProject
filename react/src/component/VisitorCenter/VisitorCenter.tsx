import React, { FC } from 'react';
import './VisitorCenter.scss';

interface VisitorCenterProps {}

const VisitorCenter: FC<VisitorCenterProps> = () => (
  <div className="visitor-center">
    {/* כותרת */}
    <header className="header">
      <h1>מרכז המבקרים - יקב גפנים</h1>
      <p>טעימות יין, סיור בכרם וחוויה בלתי נשכחת</p>
    </header>

    {/* אזור טעימות */}
    <section className="tasting-area">
      <div className="text">
        <h2>בר טעימות</h2>
        <p>
          בואו לגלות את טעמי היקב שלנו! טעימות ממבחר יינות בוטיק באווירה חמימה, לצד הסברים על תהליך הייצור.
        </p>
        <button>הזמן סיור</button>
      </div>
    
    </section>

    {/* גלריה */}
    <section className="gallery">
      <h3>ההמלצות  שלנו</h3>
      <div className="images">
        <img src="/images/איש-שותה-יין-ממקרר-יין.jpg" alt="vineyard" />
        <img src="/images/איש-שותה-יין.png" alt="wine" />
        <img src="/images/איש-שותה-י2.png" />
      </div>
    </section>
  </div>
);

export default VisitorCenter;