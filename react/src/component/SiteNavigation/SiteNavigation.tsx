import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router';
import { useWineContext } from '../../context/WineContext';
import './SiteNavigation.scss';

const wineCategories = [
  'היינות שלנו',
  'יינות מיוחדים',
  'יינות רוזה',
  'יינות לבנים',
  'יינות אדומים',
];

const SiteNavigation: FC = () => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useWineContext();
  const [showCategories, setShowCategories] = useState(false);

  const openCategory = (category: string) => {
    setSelectedCategory(category);
    setShowCategories(false);
    navigate('/Home/Wines');
  };

  return (
    <nav className="SiteNavigation" aria-label="ניווט ראשי" dir="rtl">
      <div className="site-navigation-inner">
        <button className="site-brand" type="button" onClick={() => navigate('/Home/About')}>
          PSAGOT
        </button>

        <ul className="site-navigation-links" dir="rtl">
          <li className="wine-menu">
            <button
              type="button"
              aria-expanded={showCategories}
              onClick={() => setShowCategories(open => !open)}
            >
              עולם היין
            </button>
            {showCategories && (
              <div className="wine-menu-options">
                {wineCategories.map(category => (
                  <button key={category} type="button" onClick={() => openCategory(category)}>
                    {category}
                  </button>
                ))}
              </div>
            )}
          </li>
          <li><button type="button" onClick={() => navigate('/Home/About')}>אודות</button></li>
          <li><button type="button" onClick={() => navigate('/Home/ShoppingCart')}>סל קניות</button></li>
          <li><button type="button" onClick={() => navigate('/Home/VisitorCenter')}>מרכז מבקרים</button></li>
          <li><button type="button" onClick={() => navigate('/Home/CustomerDetails')}>אזור אישי</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default SiteNavigation;