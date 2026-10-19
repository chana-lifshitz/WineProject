import React, { FC, useEffect, useState, useMemo } from 'react';
import './Wines.scss';
import { useNavigate } from 'react-router';
import { WineModel } from '../../models/wine';
import { GetAllWines, GetWinesByCategory, DeleteWine } from '../../service/wines';
import { useWineContext } from '../../context/WineContext';
import AddWineForm from '../AddWineForm/AddWineForm';
import { useDispatch } from 'react-redux';
import { showMessage } from '../../redux/messageSlice';

const Wines: FC = () => {
  const myNavigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedCategory } = useWineContext();
  const [wines, setWines] = useState<WineModel[]>([]);
  const [displayedCount, setDisplayedCount] = useState(20);
  const [showAddForm, setShowAddForm] = useState(false);

  const currentUser = JSON.parse(sessionStorage.getItem("user-data") || '{}');
  const isAdmin = currentUser?.isAdmin === true;

  useEffect(() => {
    const fetchWines = selectedCategory && selectedCategory !== 'היינות שלנו'
      ? GetWinesByCategory(selectedCategory)
      : GetAllWines();

    fetchWines
      .then((response: any) => {
        setWines(response.data.wines || response.data);
        setDisplayedCount(20);
      })
      .catch(err => {
        console.error(err);
        dispatch(showMessage({
          title: 'שגיאה',
          body: 'אירעה שגיאה בעת טעינת היינות',
          delay: 4000
        }));
      });
  }, [selectedCategory, dispatch]);

  const visibleWines = useMemo(() => wines.slice(0, displayedCount), [wines, displayedCount]);

  const handleLoadMore = () => {
    setDisplayedCount(prev => Math.min(prev + 10, wines.length));
  };

  const handleDelete = async (id: string | number) => {
    try {
      const stringId = id.toString();
      await DeleteWine(stringId);
      setWines(prev => prev.filter(w => w.id.toString() !== stringId));
      dispatch(showMessage({
        title: 'הצלחה',
        body: 'היין נמחק בהצלחה!',
        delay: 3000
      }));
    } catch (error) {
      console.error(error);
      dispatch(showMessage({
        title: 'שגיאה',
        body: 'אירעה שגיאה במחיקת היין',
        delay: 4000
      }));
    }
  };

  return (
    <div className="Wines">
      <h2 style={{ textAlign: 'center' }}>{selectedCategory || 'כל היינות'}</h2>

      {isAdmin && (
        <button
          className="add-wine-btn"
          onClick={() => myNavigate('/add-wine')}
          style={{ marginBottom: '1rem' }}
        >
          הוסף יין חדש
        </button>
      )}

      {showAddForm && (
        <AddWineForm
          onClose={() => setShowAddForm(false)}
          onWineAdded={(newWine) => {
            setWines(prev => [newWine, ...prev]);
            setShowAddForm(false);
          }}
        />
      )}

      <div className="wine-grid">
        {visibleWines.map((w: WineModel) => (
          <div
            key={w.id}
            className="wine-card"
            onClick={() => myNavigate('/WineDetails', { state: { id: w.id } })}
          >
            <h3>{w.name}</h3>
            <img
              className="product-image"
              src={`http://localhost:5000/image/${w.image}`}
              alt={w.name}
            />

            {isAdmin && (
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(w.id);
                }}
                title="מחק יין"
                type="button"
              >
                <img
                  src="/images/פח.png"
                  alt="מחק"
                  style={{ width: '20px', height: '20px' }}
                />
              </button>
            )}
          </div>
        ))}
      </div>

      {displayedCount < wines.length && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button className="load-more-btn" onClick={handleLoadMore}>
            טען עוד
          </button>
        </div>
      )}
    </div>
  );
};

export default Wines;