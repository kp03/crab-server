
import axios from 'axios';
const axiosClient = axios.create({
    baseURL: ``,
    // baseURL: `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/`,
    timeout: 10 * 1000,
});

export default axiosClient;
