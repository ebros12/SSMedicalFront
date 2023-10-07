import axios from 'axios';
const authAPI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_REACT_APP_BASE_URL  + '/auth'
});

authAPI.interceptors.request.use(config => {
    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')
    }
    return config;
})

export default authAPI;