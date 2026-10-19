import React, { FC, useState } from 'react';
import './ShoppingCart.scss';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeFromCart } from '../../redux/shoppingSlice';
import { WineModel } from '../../models/wine';
import { useNavigate } from 'react-router';
import { SendCheckoutEmail } from '../../service/wines';
import { showMessage } from '../../redux/messageSlice';

const ShoppingCart: FC = () => {
  const dispatch = useDispatch();
  const myNavigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shoppingCart: WineModel[] = useSelector(
    (state: any) => state.shoppingSlice?.shoppingCart || []
  );

  const totalPrice = shoppingCart.reduce((sum, item) => sum + item.price, 0);

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = async () => {
    const customer = JSON.parse(sessionStorage.getItem('user-data') || '{}');
    if (!customer.email) {
      dispatch(showMessage({
        title: 'לא ניתן לשלוח את ההזמנה',
        body: 'יש להתחבר לחשבון לפני התשלום.',
        delay: 4000,
      }));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await SendCheckoutEmail({
        name: customer.name || '',
        email: customer.email,
        items: shoppingCart.map(({ id, name, category, price }) => ({
          id,
          name,
          category,
          price,
        })),
        totalPrice,
      });

      if (!response.data.success) {
        throw new Error('Checkout webhook failed');
      }

      dispatch(clearCart());
      myNavigate('/purchase');
    } catch {
      dispatch(showMessage({
        title: 'שליחת ההזמנה נכשלה',
        body: 'לא הצלחנו לשלוח את פרטי ההזמנה. בדקי את החיבור ונסי שוב.',
        delay: 4000,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ShoppingCart">
      <h2>🛒 סל הקניות שלך</h2>
      <br />
      {shoppingCart.length === 0 ? (
        <p>הסל ריק כרגע</p>
      ) : (
        <div className="cart-list">
          <ul>
            {shoppingCart.map((item) => (
              <li key={item.id} className="cart-item">
                <img
                  src={`http://localhost:5000/image/${item.image}`}
                  alt={item.name}
                  className="cart-image"
                />
                <div className="cart-details">
                  <h4>{item.name}</h4>
                  <p>{item.category}</p>
                  <p>מחיר: {item.price} ₪</p>
                  <button
                    className="remove-button"
                    onClick={() => handleRemove(item.id)}
                  >
                    הסר 
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-total">
            <h3>סה״כ לתשלום: {totalPrice} ₪</h3>
          </div>
          <button onClick={handleCheckout} disabled={isSubmitting}>
            {isSubmitting ? 'שולח הזמנה...' : 'לתשלום'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
