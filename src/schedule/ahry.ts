import {
  IDuration,
  ITiming_Repeat,
  Timing_RepeatDurationUnitKind,
  Timing_RepeatPeriodUnitKind,
  Timing_RepeatWhenKind,
} from '@ahryman40k/ts-fhir-types/lib/R4';

// http://hl7.org/fhir/R4B/datatypes.html#Timing

//const dateTimeRegex =
//  /([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(.[0-9]+)?(Z|(+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?/;
const timeRegex = /([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?/;

type UnitOfTime = 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a';
type Duration = Omit<IDuration, 'code'> & {
  code: UnitOfTime;
};
type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
type T = keyof ITiming_Repeat;
type Timing = Omit<ITiming_Repeat, 'dayOfWeek' | 'boundsDuration'> & {
  boundsDuration?: Duration;
  dayOfWeek?: DayOfWeek[];
};

// Alle 8 Stunden
let schedule: Timing = {
  frequency: 1,
  period: 8,
  periodUnit: Timing_RepeatPeriodUnitKind._h,
};

console.log(
  Object.values(Timing_RepeatPeriodUnitKind).includes(
    'h' as Timing_RepeatPeriodUnitKind
  )
);

// 3-4 mal am Tag
schedule = {
  frequency: 3,
  frequencyMax: 4,
  period: 1,
  periodUnit: Timing_RepeatPeriodUnitKind._d,
};

// 3 mal in der Woche, für eine halbe Stunde
schedule = {
  duration: 0.5,
  durationUnit: Timing_RepeatDurationUnitKind._h,
  frequency: 3,
  period: 1,
  periodUnit: Timing_RepeatPeriodUnitKind._wk,
};

// 2 mal am Tag, 30 min vor Mahlzeit, für nächsten 10 Tage
schedule = {
  frequency: 2,
  period: 1,
  periodUnit: Timing_RepeatPeriodUnitKind._d,
  when: [Timing_RepeatWhenKind._ac],
  offset: 30,
  boundsDuration: {
    value: 10,
    unit: 'days',
    code: 'd',
  },
};

// Jeden zweiten Tag, Start am 18.7.2023 um 13:00 Uhr
schedule = {
  frequency: 2,
  period: 1,
  periodUnit: Timing_RepeatPeriodUnitKind._d,
  boundsPeriod: {
    start: '2023-07-18T13:00:00+00:00',
  },
};

// Mo, Mi, Fr, morgens
schedule = {
  frequency: 1,
  period: 1,
  periodUnit: Timing_RepeatPeriodUnitKind._d,
  when: [Timing_RepeatWhenKind._morn],
  dayOfWeek: ['mon', 'wed', 'fri'], // Kein autocomplete!
};

// Jeden zweiten Tag, morgens, bis 20 genommen wurden
schedule = {
  count: 20,
  frequency: 1,
  period: 2,
  periodUnit: Timing_RepeatPeriodUnitKind._d,
  when: [Timing_RepeatWhenKind._morn],
};
