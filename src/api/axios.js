import axios from "axios";


import { adminApi } from "../constants/api";

const adminApiInstance = axios.create({
    baseURL : adminApi,
    headers : {
        'Content-Type' : 'application/json',
    },
})


export { adminApiInstance }