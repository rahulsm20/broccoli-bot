export function msToMinutesAndSeconds(ms: number) {
    const totalSeconds = ms / 1000;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return {
      minutes: minutes,
      seconds: seconds,
    };
  }