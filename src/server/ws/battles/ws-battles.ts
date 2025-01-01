import { type Server as SocketServer } from "socket.io";
import {
  demoBattle,
  parseOutSplitChunks,
  registerListeners,
} from "./demo-battle";
import { type SideID } from "@pkmn/sim";
import { type Side } from "@/app/types/battle";

export function initBattles(io: SocketServer) {
  const battles = io.of("battles");

  battles.use((socket, next) => {
    const { battle_id, side } = socket.handshake.headers;
    if (typeof battle_id === "string" && typeof side === "string") {
      next();
    } else {
      console.error(battle_id, side);
      next(new Error("invalid"));
    }
  });

  battles.on("connection", async (socket) => {
    const { battle_id: battleId, side } = socket.handshake.headers;
    if (!(typeof battleId === "string") || !(typeof side === "string")) {
      return;
    }

    console.log(`user connected to ${battleId} : ${side}`);

    await socket.join(battleId);
    await socket.join(`${battleId}:${side}`);

    // Send current battle state
    socket.emit("battle", parseOutSplitChunks(demoBattle.log, side as Side));

    // Send current request state
    if (side.startsWith("p")) {
      const activeRequest = demoBattle.getSide(side as SideID).activeRequest;
      if (activeRequest) {
        socket.emit("battle", `|request|${JSON.stringify(activeRequest)}`);
      }
    }

    // Send init done
    socket.emit("battle", "|initdone");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  registerListeners(battles);
}
