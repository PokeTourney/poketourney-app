import io, { type Socket } from "socket.io-client";
import { type Side } from "../types/battle";

export type BattleMessageHandler = (message: string) => void;

export class BattleStream {
  private readonly battleId: string;
  private readonly side: Side;

  private readonly listeners: BattleMessageHandler[];

  private socket: Socket;

  constructor(
    battleId: string,
    side: Side,
    ...listeners: BattleMessageHandler[]
  ) {
    this.battleId = battleId;
    this.side = side;

    this.listeners = [...listeners];

    this.socket = io("/battles", {
      extraHeaders: {
        battle_id: battleId,
        side,
      },
    });

    this.socket.on("connect", () => {
      console.log(`WS connection to batte ${battleId} : ${side} open.`);
    });

    this.socket.on("battle", (messages: string[]) => {
      console.log(`[WS battle]`, messages);

      if (typeof messages === "string") {
        messages = [messages];
      }

      for (const message of messages) {
        this.listeners.forEach((listener) => listener(message));
      }
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected");
      this.destroy();
    });
  }

  addListener(handler: BattleMessageHandler) {
    this.listeners.push(handler);
  }

  removeListener(handler: BattleMessageHandler) {
    const index = this.listeners.indexOf(handler);
    this.listeners.splice(index, index);
  }

  destroy() {
    this.socket.close();
  }

  write(message: string) {
    this.socket.send(message);
  }

  undo() {
    this.write("undo");
  }

  choices(
    choices: (
      | { type: "pass" }
      | {
          type: "move";
          index: number;
          target?: number;
          special?: "mega" | "zmove" | "max";
        }
      | { type: "switch"; index: number }
    )[],
  ) {
    this.write(
      choices
        .map((choice) => {
          switch (choice.type) {
            case "pass":
              return "pass";
            case "move":
              return ["move", choice.index, choice.target, choice.special]
                .filter((x) => x)
                .join(" ");
            case "switch":
              return `switch ${choice.index}`;
          }
        })
        .join(", "),
    );
  }
}
