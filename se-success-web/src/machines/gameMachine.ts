import { createMachine, assign } from "xstate";
import type { Stats, ScenarioNode, ConditionalNext } from "@/content/scenarios";
import { scenarios } from "@/content/scenarios";

export type GameContext = {
  stats: Stats;
  currentNodeId: string;
};

export type Start = { type: "START" };
export type Choose = { type: "CHOOSE"; choiceId: string };
export type GameEvent = Start | Choose;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function applyEffects(stats: Stats, effects: Partial<Omit<Stats, "week">>): Stats {
  return {
    week: stats.week + 1,
    stamina: clamp(stats.stamina + (effects.stamina ?? 0), 0, 100),
    research: clamp(stats.research + (effects.research ?? 0), 0, 100),
  };
}

function evalConditionalNext(cond: ConditionalNext, stats: Stats): string {
  const a = stats[cond.stat] as number;
  const b = cond.value;
  let pass = false;
  if (cond.op === ">=") pass = a >= b;
  else if (cond.op === "<") pass = a < b;
  else if (cond.op === ">") pass = a > b;
  return pass ? cond.then : cond.else;
}

export const gameMachine = createMachine({
  id: "game",
  context: {
    stats: { week: 1, stamina: 100, research: 0 } as Stats,
    currentNodeId: "start",
  } as GameContext,
  initial: "idle",
  states: {
    idle: {
      entry: ({ context }) => {
        console.log("=== IDLE State Entry ===");
        console.log("Initial context:", context);
        console.log("Available scenarios:", Object.keys(scenarios));
        console.log("Start scenario:", scenarios["start"]);
      },
      on: {
        START: {
          target: "playing",
          actions: ({ context }) => {
            console.log("=== START Event ===");
            console.log("Game started, transitioning to playing state");
            console.log("Current node ID:", context.currentNodeId);
            console.log("Current node:", scenarios[context.currentNodeId]);
          },
        },
      },
    },
    playing: {
      entry: ({ context }) => {
        console.log("=== PLAYING State Entry ===");
        console.log("Current context:", context);
        console.log("Current node:", scenarios[context.currentNodeId]);
      },
      on: {
        CHOOSE: {
          actions: [
            ({ context, event }) => {
              console.log("=== CHOOSE Event Debug ===");
              console.log("Full event object:", event);
              console.log("Event type:", event.type);
              console.log("Event choiceId:", event.choiceId);
              console.log("Event keys:", Object.keys(event));
              console.log("Current node ID:", context.currentNodeId);
              
              const node: ScenarioNode = scenarios[context.currentNodeId];
              console.log("Current node:", node);
              console.log("Available choices:", node?.choices);
              
              if (!event.choiceId) {
                console.error("Event choiceId is missing or undefined");
                return;
              }
              
              if (!node || !node.choices) {
                console.error("Current node or choices not found");
                console.error("Available scenarios:", Object.keys(scenarios));
                return;
              }
              
              const choice = node.choices.find((c) => c.id === event.choiceId);
              if (!choice) {
                console.error("Choice not found for ID:", event.choiceId);
                console.error("Available choice IDs:", node.choices.map(c => c.id));
                return;
              }

              console.log("Found choice:", choice);
              console.log("Applying effects:", choice.effects);
              
              // 2) 分岐決定
              let nextId: string;
              if (typeof choice.next === "string") {
                nextId = choice.next;
              } else {
                nextId = evalConditionalNext(choice.next, context.stats);
              }
              console.log("Next node:", nextId);
              console.log("=== End CHOOSE Event Debug ===");
            },
            // XStateのassignアクションを使用してcontextを更新
            assign({
              stats: ({ context, event }) => {
                const node: ScenarioNode = scenarios[context.currentNodeId];
                const choice = node.choices.find((c) => c.id === (event as Choose).choiceId);
                if (!choice) return context.stats;
                return applyEffects(context.stats, choice.effects);
              },
              currentNodeId: ({ context, event }) => {
                const node: ScenarioNode = scenarios[context.currentNodeId];
                const choice = node.choices.find((c) => c.id === (event as Choose).choiceId);
                if (!choice) return context.currentNodeId;
                
                if (typeof choice.next === "string") {
                  return choice.next;
                } else {
                  return evalConditionalNext(choice.next, context.stats);
                }
              },
            }),
          ],
        },
      },
    },
  },
});
