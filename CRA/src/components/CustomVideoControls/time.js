export function secondsToTime(secs) {
  const hours = Math.floor(secs / (60 * 60));
  const minutesDivisor = secs % (60 * 60);
  const minutes = Math.floor(minutesDivisor / 60);

  const secondsDivisor = minutesDivisor % 60;
  const seconds = Math.ceil(secondsDivisor);
  return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
}

function twoDigits(n) {
  return n > 9 ? `${n}` : `0${n}`;
}