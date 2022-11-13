//import { TimingRepeat } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4';

import { TimingRepeat } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/timingRepeat';

// Alle 8 Stunden
let schedule: TimingRepeat = {
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
  when: ['AC'], // Kein autocomplete!
  offset: 30,
  boundsDuration: {
    value: 10,
    unit: 'd',
  },
};

// Mo, Mi, Fr, morgens
schedule = {
  frequency: 1,
  period: 1,
  periodUnit: 'd',
  when: ['MORN'], // Kein autocomplete!
  dayOfWeek: ['mon', 'wed', 'fri'], // Kein autocomplete!
};

// Jeden zweiten Tag, morgens, bis 20 genommen wurden
schedule = {
  count: 20,
  frequency: 1,
  period: 2,
  periodUnit: 'd',
  when: ['MORN'], // Kein autocomplete!
};
