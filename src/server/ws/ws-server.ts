import { type Server } from "http";
import { Server as SocketServer } from "socket.io";
import { initBattles } from "./battles/ws-battles";

let io: SocketServer;

export function initWebSockets(server: Server) {
  io = new SocketServer(server);

  initBattles(io);
}
