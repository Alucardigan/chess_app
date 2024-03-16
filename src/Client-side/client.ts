import { io } from "socket.io-client"

const socket = io('http://localhost:3000')
export function Client(){

}
export function createRoom(){
    console.log("create a Room")
    socket.emit('create-room')
}
socket.on('room-created',(roomId)=>{

});
