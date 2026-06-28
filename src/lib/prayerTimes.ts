import { Coordinates, CalculationMethod, PrayerTimes as AdhanTimes, HighLatitudeRule, PolarCircleResolution } from 'adhan';

const BIRSK = new Coordinates(55.4213, 55.5434);
const TIMEZONE = 'Asia/Yekaterinburg';
const JUMA_DEFAULT = '13:00';

function formatTime(date: Date): string {
  return date.toLocaleString('ru-RU', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function calculatePrayerTimes(date: Date) {
  const params = CalculationMethod.Other();
  params.fajrAngle = 16;
  params.ishaAngle = 15;
  params.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight;
  params.polarCircleResolution = PolarCircleResolution.AqrabYaum;

  const times = new AdhanTimes(BIRSK, date, params);

  return {
    date: date.toISOString(),
    fajr: formatTime(times.fajr),
    dhuhr: formatTime(times.dhuhr),
    asr: formatTime(times.asr),
    maghrib: formatTime(times.maghrib),
    isha: formatTime(times.isha),
    juma: JUMA_DEFAULT,
  };
}
