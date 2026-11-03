import { API_URL } from '../config';
import axios from 'axios';
import { WineModel } from '../models/wine';

export function GetAllWines() {
  return axios.get(`${API_URL}/api/wines`);
}

export function GetWinesById(id: number) {
  return axios.get(`${API_URL}/api/wines/${id}`);
}

export function GetWinesByCategory(category: string) {
  return axios.get(`${API_URL}/api/wines/category/${encodeURIComponent(category)}`);
}

export function AddWineReview(id: string, reviewObj: { clientId: string, clientName: string, comment: string }) {
  return axios.post(`${API_URL}/api/wines/${id}/review`, reviewObj);
}


export function UploadWineImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  return axios.post(`${API_URL}/api/wines/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}


export function AddWine(wineData: {
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
}) {
  return axios.post(`${API_URL}/api/wines`, wineData);
}

export function DeleteWine(id: string) {
  return axios.delete(`${API_URL}/api/wines/${id}`);
}

export function CheckCustomer(email: string, password: string) {
  return axios.post(`${API_URL}/api/customers/login`, {
    email,
    password
  });
}

export function GoogleCustomerLogin(credential: string) {
  return axios.post(`${API_URL}/api/customers/google`, { credential });
}

export function SendCheckoutEmail(order: {
  name: string;
  email: string;
  items: Array<Pick<WineModel, 'id' | 'name' | 'category' | 'price'>>;
  totalPrice: number;
}) {
  return axios.post(`${API_URL}/api/checkout/email`, order);
}

export function AddCustomer(name:string, email: string, password: string) {
  return axios.post(`${API_URL}/api/customers/signUp`, {
    name,
    email,
    password
  });
}

export function updateCustomer(id: string, name: string, email: string, password: string, isAdmin: boolean) {
  return axios.put(`${API_URL}/api/customers/${id}`, {
    id,
    name,
    email,
    password,
    isAdmin
  });

}

export function deleteWineReview(wineId: string, reviewIndex: number) {
  return axios.delete(`${API_URL}/api/wines/${wineId}/review/${reviewIndex}`);
}