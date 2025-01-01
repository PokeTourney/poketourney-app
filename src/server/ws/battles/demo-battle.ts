import { type Side } from "@/app/types/battle";
import { TeamGenerators } from "@pkmn/randoms";
import {
  Battle,
  BattleStreams,
  type ID,
  RandomPlayerAI,
  Teams,
} from "@pkmn/sim";
import { type Namespace } from "socket.io";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
Teams.setGeneratorFactory(TeamGenerators);

const stream = new BattleStreams.BattleStream();
export const demoBattle = new Battle({
  formatid: "gen9randombattle" as ID,
  send(t, data) {
    if (Array.isArray(data)) data = data.join("\n");

    stream.pushMessage(t, data);

    if (t === "end" && !stream.keepAlive) stream.pushEnd();
  },
});
stream.battle = demoBattle;

const streams = BattleStreams.getPlayerStreams(stream);

const p2 = new RandomPlayerAI(streams.p2);
void p2.start();

const p1spec = {
  name: "Player 1",
  team: Teams.pack(Teams.generate("gen9randombattle")),
};
const p2spec = {
  name: "Player 2",
  team: Teams.pack(Teams.generate("gen9randombattle")),
};
void streams.omniscient.write(`>player p1 ${JSON.stringify(p1spec)}
>player p2 ${JSON.stringify(p2spec)}`);

function registerListenersForSide(namespace: Namespace, side: Side) {
  const stream = streams[side];
  void (async () => {
    for await (const chunk of stream) {
      namespace
        .to(`testbattle:${side}`)
        .emit("battle", parseOutSplitChunks(chunk.split("\n"), side));
    }
  })();
}

export function registerListeners(namespace: Namespace) {
  for (const side of Object.keys(streams)) {
    registerListenersForSide(namespace, side as Side);
  }
}

export function parseOutSplitChunks(parts: string[], side: Side): string[] {
  const result: string[] = [];

  for (let i = 0; i < parts.length; ) {
    if (parts[i]?.startsWith("|split|")) {
      const targetSide = parts[i]?.slice(1).split("|")[0];
      if (side === "omniscient" || side === targetSide) {
        result.push(parts[i + 1]!);
      } else {
        result.push(parts[i + 2]!);
      }
      i += 3;
    } else {
      result.push(parts[i]!);
      i++;
    }
  }

  return result;
}
