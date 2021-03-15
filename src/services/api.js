import axios from 'axios';

const api = axios.create({
    baseURL: 'https://nutcache-challenge-backend.herokuapp.com/'
});

export default api;