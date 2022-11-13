import { Repeat } from './custom.types';

// Alle 8 Stunden
let schedule: Repeat = {
  frequency: 1,
  period: 8,
  periodUnit: 'h',
};

// 3-4 mal am Tag
schedule = {
  frequency: 3,
  frequencyMax: 4,
  period: 1,
  periodUnit: 'd',
};

// 3 mal in der Woche, für eine halbe Stunde
schedule = {
  duration: 0.5,
  durationUnit: 'h',
  frequency: 3,
  period: 1,
  periodUnit: 'wk',
};

// 2 mal am Tag, 30 min vor Mahlzeit, für nächsten 10 Tage
schedule = {
  frequency: 2,
  period: 1,
  periodUnit: 'd',
  when: ['AC'],
  offset: 30,
  boundsDuration: {
    value: 10,
    unit: 'd',
  },
};

// Jeden zweiten Tag, Start am 18.7.2023 um 13:00 Uhr
schedule = {
  frequency: 2,
  period: 1,
  periodUnit: 'd',
  boundsPeriod: {
    start: new Date('2023-07-18T13:00:00+00:00'),
  },
};

console.log(schedule.boundsPeriod?.start);

// Mo, Mi, Fr, morgens
schedule = {
  frequency: 1,
  period: 1,
  periodUnit: 'd',
  when: ['MORN'],
  dayOfWeek: ['mon', 'wed', 'fri'],
};

// Jeden zweiten Tag, morgens, bis 20 genommen wurden
schedule = {
  count: 20,
  frequency: 1,
  period: 2,
  periodUnit: 'd',
  when: ['MORN'],
};
