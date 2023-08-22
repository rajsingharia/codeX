import { Socket, io } from 'socket.io-client';

const URL = 'http://localhost:5000';

export const getSocket = (): Socket => {
    const token = localStorage.getItem('accessToken');
    const socket = io(URL, {
        autoConnect: false,
        auth: {
            token: token
        }
    });
    return socket;
}
