import axios from 'axios';

export function GetAllWines() {
  return axios.get('http://localhost:5000/api/wines');
}

export function GetWinesById(id: number) {
  return axios.get(`http://localhost:5000/api/wines/${id}`);
}

export function GetWinesByCategory(category: string) {
  return axios.get(`http://localhost:5000/api/wines/category/${encodeURIComponent(category)}`);
}

export function AddWineReview(id: string, reviewObj: { clientId: string, clientName: string, comment: string }) {
  return axios.post(`http://localhost:5000/api/wines/${id}/review`, reviewObj);
}


export function UploadWineImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  return axios.post('http://localhost:5000/api/wines/upload-image', formData, {
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
  return axios.post('http://localhost:5000/api/wines', wineData);
}

export function DeleteWine(id: string) {
  return axios.delete(`http://localhost:5000/api/wines/${id}`);
}

export function CheckCustomer(email: string, password: string) {
  return axios.post('http://localhost:5000/api/customers/login', {
    email,
    password
  });
}

export function GoogleCustomerLogin(credential: string) {
  return axios.post('http://localhost:5000/api/customers/google', { credential });
}

export function SendCheckoutEmail(order: {
  name: string;
  email: string;
  items: Array<Pick<WineModel, 'id' | 'name' | 'category' | 'price'>>;
  totalPrice: number;
}) {
  return axios.post('http://localhost:5000/api/checkout/email', order);
}

export function AddCustomer(name:string, email: string, password: string) {
  return axios.post('http://localhost:5000/api/customers/signUp', {
    name,
    email,
    password
  });
}

export function updateCustomer(id: string, name: string, email: string, password: string, isAdmin: boolean) {
  return axios.put(`http://localhost:5000/api/customers/${id}`, {
    id,
    name,
    email,
    password,
    isAdmin
  });

}

export function deleteWineReview(wineId: string, reviewIndex: number) {
  return axios.delete(`http://localhost:5000/api/wines/${wineId}/review/${reviewIndex}`);
}