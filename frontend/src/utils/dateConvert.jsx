
// utils/dateUtils.js

export function dateConvert(date) {
  const d = new Date(date);
  const pad = (n) => (n < 10 ? '0' + n : n);

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}