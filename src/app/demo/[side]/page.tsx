"use client";

import BattleControls from "@/app/components/battle/battle-controls";
import BattleDisplay from "@/app/components/battle/battle-display";
import { type Side } from "@/app/types/battle";
import { useParams } from "next/navigation";
import { useRef } from "react";

import classes from "./page.module.css";

export default function DemoPage() {
  const params = useParams();
  const side: Side = params.side as Side;

  const battleId = "testbattle";

  const logsRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div>
        {battleId} : {side}
      </div>
      <BattleDisplay
        logsRef={logsRef}
        battleId={battleId}
        side={side}
        battleClasses={classes.battle}
      />
      <div className="battle-logs" ref={logsRef}></div>
      {side.startsWith("p") && (
        <BattleControls battleId={battleId} side={side} />
      )}
    </div>
  );
}
