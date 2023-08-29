import { Socket, io } from 'socket.io-client';
import Cookies from 'universal-cookie';


//TODO: This is a temporary solution, the URL should be set in an environment variable
const URL = 'http://localhost:5000';

export const getSocket = (): Socket => {
    const cookies = new Cookies();
    const token = cookies.get('accessToken', { doNotParse: true })
    const socket = io(URL, {
        autoConnect: false,
        auth: {
            token: token
        }
    });
    return socket;
}
