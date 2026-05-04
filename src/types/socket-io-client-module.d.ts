// Резолв типов: в v3 основной export указывает на wrapper.mjs без types в "exports".
declare module "socket.io-client" {
  export { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client/build/index";
}
