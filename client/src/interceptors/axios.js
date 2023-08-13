import axios from 'axios';
axios.defaults.baseURL = 'https://billing-server-x3d4.onrender.com';
axios.interceptors.request.use(function (config) {
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)_auth\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    config.headers.Authorization =  `bearer ${token}`;     
    return config;
});