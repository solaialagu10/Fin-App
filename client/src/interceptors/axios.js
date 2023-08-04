import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000/';
axios.interceptors.request.use(function (config) {
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)_auth\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    config.headers.Authorization =  `bearer ${token}`;     
    return config;
});