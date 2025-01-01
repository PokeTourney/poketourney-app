import { type Side } from "@/app/types/battle";
import { BattleStream } from "@/app/utils/battle-stream";
import { Protocol, type Request } from "@pkmn/protocol";
import { useCallback, useEffect, useRef, useState } from "react";

import "public/ps/style/battle.css";

interface Props {
  battleId: string;
  side: Side;
}

interface Move {}

interface Switch {}

export default function BattleControls(props: Props) {
  const battleStreamRef = useRef<BattleStream>();
  const [request, setRequest] = useState<Request | null>(null);
  const [moveChoices, setMoveChoices] = useState<Move[]>([]);
  const [switchChoices, setSwitchChoices] = useState<Move[]>([]);
  const [tempChoices, setTempChoices] = useState("Waiting for opponent...");

  const handleRequest = useCallback((req: Request | null) => {
    setRequest(req);

    if (!req) {
      setMoveChoices([]);
      setSwitchChoices([]);
      setTempChoices("Waiting for opponent...");
      return;
    }

    setTempChoices(JSON.stringify(req, null, 2));

    // TODO: implement
  }, []);

  const resetChoices = useCallback(() => {
    handleRequest(request);
  }, []);

  const handleMessage = useCallback((message: string) => {
    for (const { args } of Protocol.parse(message)) {
      //   console.log(message, args, kwArgs);

      switch (args[0]) {
        case "request":
          handleRequest(args[1] ? Protocol.parseRequest(args[1]) : null);
          break;
        case "win":
        case "tie":
          handleRequest(null);
          break;
        case "error":
          if (args[1].startsWith("[Invalid choice]") && request) {
            resetChoices();
          }
          break;
      }
    }
  }, []);

  useEffect(() => {
    if (battleStreamRef.current) {
      battleStreamRef.current.destroy();
    }
    battleStreamRef.current = new BattleStream(
      props.battleId,
      props.side,
      handleMessage,
    );

    return () => {
      battleStreamRef.current?.destroy();
    };
  }, [handleMessage, props.battleId, props.side]);

  return (
    <div>
      <pre>{tempChoices}</pre>
    </div>
  );
}
