import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const dashboardAPI = axios.create({
   
    baseURL: process.env.NEXT_PUBLIC_REACT_APP_BASE_URL + '/dashboard'
});

dashboardAPI.interceptors.request.use(config =>{
    config.headers = {
        ...config.headers,
        'x-token' : localStorage.getItem('token')
    }
    return config;
})

export default dashboardAPI;