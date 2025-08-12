declare module 'howler' {
  export class Howl {
    constructor(options: any);
    play(): void;
    stop(): void;
    unload(): void;
  }
  
  export namespace Howler {
    function mute(muted: boolean): void;
  }
}
