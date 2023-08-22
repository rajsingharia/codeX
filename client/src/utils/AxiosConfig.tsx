import axios, { AxiosRequestConfig } from "axios";


export const AuthAxios = () => {
    //create config for credentials: 'include'
    const config: AxiosRequestConfig = {
        withCredentials: true
    }
    return axios.create(config);
}