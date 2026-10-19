import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router';
import { WineProvider } from './context/WineContext';
import { Provider } from 'react-redux';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import shoppingSlice from './redux/shoppingSlice';
import { WineModel } from './models/wine';
import userSlice from './redux/userSlice'; 
import messageSlice from './redux/messageSlice';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const myStore = configureStore({
  reducer: {
    userSlice:userSlice,
messageSlice :messageSlice,
shoppingSlice:shoppingSlice
  }
});
root.render(
  <Provider store={myStore}>
  <BrowserRouter>
  <WineProvider>
    <App />
    </WineProvider>
 </BrowserRouter>
 </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
