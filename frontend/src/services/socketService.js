// // services/socketService.js
// import { io } from "socket.io-client";

// class SocketService {
//     constructor() {
//         this.socket = null;
//         this.listeners = {};
//     }

//     connect(userId) {
//         if (this.socket) {
//             this.disconnect();
//         }

//         this.socket = io('http://localhost:8000', {
//             query: { userId },
//             transports: ['websocket'],
//             autoConnect: true,
//             reconnection: true,
//             reconnectionAttempts: 5,
//             reconnectionDelay: 1000,
//         });

//         this.socket.on('connect', () => {
//             console.log('Socket connected successfully');
//             this.emit('connectionStatus', true);
//         });

//         this.socket.on('disconnect', () => {
//             console.log('Socket disconnected');
//             this.emit('connectionStatus', false);
//         });

//         this.socket.on('connect_error', (error) => {
//             console.error('Socket connection error:', error);
//         });

//         return this.socket;
//     }

//     disconnect() {
//         if (this.socket) {
//             this.socket.disconnect();
//             this.socket = null;
//         }
//     }

//     on(event, callback) {
//         if (this.socket) {
//             this.socket.on(event, callback);
//         }
//     }

//     off(event, callback) {
//         if (this.socket) {
//             this.socket.off(event, callback);
//         }
//     }

//     emit(event, data) {
//         if (this.socket) {
//             this.socket.emit(event, data);
//         }
//     }

//     getSocket() {
//         return this.socket;
//     }

//     isConnected() {
//         return this.socket ? this.socket.connected : false;
//     }
// }

// // ✅ Create a single instance
// export const socketService = new SocketService();