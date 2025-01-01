/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type Side } from "@/app/types/battle";
import { BattleStream } from "@/app/utils/battle-stream";
import Script from "next/script";
import { useEffect, useRef, type RefObject } from "react";

import "public/ps/style/battle.css";

interface Props {
  battleClasses?: string;
  logsRef: RefObject<HTMLElement>;
  battleId: string;
  side: Side;
}

export default function BattleDisplay(props: Props) {
  const battleDivRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const battleObjRef = useRef<any>();
  const battleStreamRef = useRef<BattleStream>();

  function handleMessage(message: string) {
    if (!message.startsWith("|")) {
      return;
    }

    const args = message.split("|");

    switch (args[1]) {
      case "initdone":
        battleObjRef.current.seekTurn(Infinity);
        return;
      case "request":
        return;
      case "c":
      case "c:":
      case "chat":
      case "chatmsg":
      case "inactive":
        battleObjRef.current.instantAdd(message);
        return;
    }

    battleObjRef.current.add(message);
  }

  useEffect(() => {
    // Destroy existing battle object
    if (battleObjRef.current) {
      battleObjRef.current.destroy();
    }

    // Create new battle object
    // @ts-expect-error Battle is defined globally
    battleObjRef.current = new Battle({
      $frame: $(battleDivRef.current!),
      $logFrame: $(props.logsRef.current!),
    });

    // Recreate battle stream
    if (battleStreamRef.current) {
      battleStreamRef.current.destroy();
    }
    battleStreamRef.current = new BattleStream(
      props.battleId,
      props.side,
      handleMessage,
    );

    // Stream cleanup callback
    return () => {
      battleStreamRef.current?.destroy();
    };
  }, [props.logsRef, props.battleId, props.side]);

  return (
    <>
      <div
        className={`battle ${props.battleClasses ?? ""}`}
        ref={battleDivRef}
      />
      <Script
        type="text/javascript"
        strategy="beforeInteractive"
        src="https://play.pokemonshowdown.com/js/lib/jquery-2.2.4.min.js"
      />
      <Script
        type="text/javascript"
        strategy="beforeInteractive"
        src="https://play.pokemonshowdown.com/config/config.js"
      />
      <Script
        type="text/javascript"
        strategy="beforeInteractive"
        src="https://play.pokemonshowdown.com/js/battle.js"
      />
      <Script
        type="text/javascript"
        strategy="beforeInteractive"
        src="https://play.pokemonshowdown.com/js/battledata.js"
      />
      <Script
        type="text/javascript"
        strategy="beforeInteractive"
        src="https://play.pokemonshowdown.com/js/battle-tooltips.js"
      />
      <Script
        type="text/javascript"
        strategy="beforeInteractive"
        src="https://play.pokemonshowdown.com/js/battle-sound.js"
      />
      <Script
        type="text/javascript"
        strategy="beforeInteractive"
        src="https://play.pokemonshowdown.com/data/graphics.js"
      />
    </>
  );
}
