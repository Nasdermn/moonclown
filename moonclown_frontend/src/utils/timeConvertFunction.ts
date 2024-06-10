export function Timeconverter(time: number) {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return hours === 0 ? `${minutes} мин` : `${hours}ч ${minutes}мин`;
}
