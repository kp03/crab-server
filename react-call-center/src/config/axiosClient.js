
import axios from 'axios';



const axiosClient = axios.create({
    baseURL: `http://${import.meta.env.VITE_SERVER_HOST}:${import.meta.env.VITE_SERVER_PORT}`,
    // baseURL: ,
    timeout: 10 * 1000,
});

export default axiosClient;
