export type Stats = {
    week: number;
    stamina: number;
    research: number;
  };
  
  export type ConditionalNext = {
    type: "threshold";
    stat: keyof Omit<Stats, "week">; // stamina | research
    op: ">=" | "<" | ">";
    value: number;
    then: string;
    else: string;
  };
  
  export type Choice = {
    id: string;
    label: string;
    effects: Partial<Omit<Stats, "week">>; // 週は外で+1管理
    next: string | ConditionalNext;
  };
  
  export type ScenarioNode = {
    id: string;
    title: string;
    description?: string;
    choices: Choice[];
  };
  
  export const scenarios: Record<string, ScenarioNode> = {
    start: {
      id: "start",
      title: "博士課程・1週目",
      description: "最初の週。何をする？",
      choices: [
        {
          id: "do_experiment",
          label: "実験をする",
          effects: { stamina: -10, research: +15 },
          next: {
            type: "threshold",
            stat: "research",
            op: ">=",
            value: 50,
            then: "week2_success",
            else: "week2_normal",
          },
        },
        {
          id: "read_paper",
          label: "論文を読む",
          effects: { stamina: -5, research: +8 },
          next: "week2_normal",
        },
      ],
    },
    week2_normal: {
      id: "week2_normal",
      title: "2週目（通常ルート）",
      description: "コツコツ進めよう。",
      choices: [
        { id: "seminar", label: "セミナー参加", effects: { stamina: -5, research: +10 }, next: "week3" },
        { id: "rest", label: "休む", effects: { stamina: +15 }, next: "week3" },
      ],
    },
    week2_success: {
      id: "week2_success",
      title: "2週目（加速ルート）",
      description: "研究が波に乗っている！",
      choices: [
        { id: "push", label: "さらに詰める", effects: { stamina: -10, research: +20 }, next: "week3" },
        { id: "balance", label: "バランスよく", effects: { stamina: -5, research: +12 }, next: "week3" },
      ],
    },
    week3: {
      id: "week3",
      title: "3週目",
      description: "ここから分岐を増やしていける。",
      choices: [
        { id: "ok", label: "OK（デモ終端）", effects: {}, next: "week3" },
      ],
    },
  };
  