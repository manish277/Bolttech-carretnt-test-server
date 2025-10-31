import dayjs from 'dayjs';

function getSeason(date) {
  const d = dayjs(date);
  const m = d.month() + 1;
  const day = d.date();

  // Peak: June 1 - September 15
  if ((m === 6 && day >= 1) || (m > 6 && m < 9) || (m === 9 && day <= 15)) return 'peak';
  
  // Mid: March 1 - May 31, September 16 - October 31
  if ((m >= 3 && m < 6) || (m === 9 && day >= 16) || m === 10) return 'mid';
  
  // Off: November 1 - February 29
  return 'off';
}

export { getSeason };
