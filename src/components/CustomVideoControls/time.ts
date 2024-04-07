export function secondsToTime(secs: number) {
  const hours = Math.floor(secs / (60 * 60));
  const minutesDivisor = secs % (60 * 60);
  const minutes = Math.floor(minutesDivisor / 60);

  const secondsDivisor = minutesDivisor % 60;
  const seconds = Math.ceil(secondsDivisor);
  return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
}

function twoDigits(n: number) {
  return n > 9 ? `${n}` : `0${n}`;
}
