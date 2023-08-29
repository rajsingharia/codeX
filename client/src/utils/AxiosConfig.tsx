import axios, { AxiosRequestConfig } from "axios";


export const AuthAxios = () => {
    //TODO: include base url (from env)
    const config: AxiosRequestConfig = {
        withCredentials: true
    }
    return axios.create(config);
}