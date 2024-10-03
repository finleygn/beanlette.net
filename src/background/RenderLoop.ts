export interface LoopTimings {
  elapsedTime: number;
  deltaTime: number;
  time: number;
}

class RenderLoop {
  static start(callback: (timings: LoopTimings) => void) {
    let lastElapsedTime: number = 0;
    let time = 0;

    const runner = (elapsedTime: number) => {
      if (!lastElapsedTime) { lastElapsedTime = elapsedTime; }
      const deltaTime = elapsedTime - lastElapsedTime;
      lastElapsedTime = elapsedTime;
      time += deltaTime;

      requestAnimationFrame(runner);
      callback({ elapsedTime, deltaTime, time });
    }

    requestAnimationFrame(runner);
  }
}

export default RenderLoop;