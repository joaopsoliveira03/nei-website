import client from './Client';
import AuthenticatedClient from './AuthenticatedClient';
import { AxiosError } from 'axios';
import { IUser } from '@src/interfaces/IUser';
import { toast, Bounce } from 'react-toastify';



export const loginUser = async (login : IUser) => {
  try {
    const base64Credentials = btoa(`${login.username}:${login.password}`);
    const response = await client.post(
      '/api/auth/login/',
      {},
      {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      }
    );
    if (response.status === 200) {
      if (response.data.token && response.data.expiry) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('expiry', response.data.expiry);
        try {
          const user = await getUser();
          if (user.profilemodel?.image) {
            localStorage.setItem('profile', user.profilemodel.image);
          }
          if (user.profilemodel?.course) {
            localStorage.setItem('courses', JSON.stringify(user.profilemodel.course));
          }
        } catch (error) {
          // Do nothing
        }
        return "";
      }
    }
    return "Invalid credentials!";
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        if (error.response.status === 401) {
          return "Invalid credentials!";
        }
      }
    }
    return "Something went wrong!";
  }
};

export const registerUser = async (register : IUser) => {
  const response = await client.post('/api/user/', register);
  if (response.status !== 201) throw new Error(response.data);
  return response.data as IUser;
};

export const logoutUser = async (allDevices: boolean) => {
  try {
    if (allDevices) {
      AuthenticatedClient.post('/api/auth/logoutall/');
    } else {
      AuthenticatedClient.post('/api/auth/logout/');
    }
  } catch (error) {
    toast.error('There was an error when logging out! Still logged out locally!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
    localStorage.removeItem('profile');
    localStorage.removeItem('courses');
  }
};

export const getUser = async () => {
  const response = await AuthenticatedClient.get('/api/user/');
  if (response.status !== 200) throw new Error(response.data);
  return response.data[0] as IUser;
}

export const updateUser = async (user : IUser) => {
  const response = await AuthenticatedClient.put(`/api/user/${user.username}/`, user);
  if (response.status !== 200) throw new Error(response.data);
  return response.data as IUser;
}

export const changePassword = async (passwords : {oldPassword: string, newPassword: string}) => {
  const response = await AuthenticatedClient.post('/api/auth/changePassword/', passwords);
  if (response.status !== 204) throw new Error(response.data);
}

export const getResetPasswordCode = async (username: string) => {
  const response = await client.get('/api/auth/resetPassword/?username=' + username);
  if (response.status !== 204) throw new Error(response.data);
}

export const resetPassword = async (data : {username: string, code: string, password: string}) => {
  const response = await client.post('/api/auth/resetPassword/', data);
  if (response.status !== 204) throw new Error(response.data);
}

export const getActivateAccountCode = async (username: string) => {
  const response = await client.get('/api/auth/activateAccount/?username=' + username);
  if (response.status !== 204) throw new Error(response.data);
}

export const activateAccount = async (data: {code: string}) => {
  const response = await client.post('/api/auth/activateAccount/', data);
  if (response.status !== 204) throw new Error(response.data);
}
