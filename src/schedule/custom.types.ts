export type Schedule = {
  code?: {
    text?: string;
    value?: TimingAbbreviation;
  };
  event?: Date[];
  repeat?: Repeat;
};

// http://hl7.org/fhir/R4B/valueset-timing-abbreviation.html
const TimingAbbreviations = [
  'C', // FHIR 5.0 only
  'BID',
  'TID',
  'QID',
  'AM',
  'PM',
  'QD',
  'QOD',
  'Q1H',
  'Q2H',
  'Q3H',
  'Q4H',
  'Q6H',
  'Q8H',
  'BED',
  'WK',
  'MO',
] as const;
type TimingAbbreviationsType = typeof TimingAbbreviations;
export type TimingAbbreviation = TimingAbbreviationsType[number];

export type PositiveInt = number;
export type Decimal = number;
export type UnsignedInt = number;

// http://hl7.org/fhir/R4B/valueset-units-of-time.html
export const UnitsOfTime = ['s', 'min', 'h', 'd', 'wk', 'mo', 'a'] as const;
type UnitsOfTimeType = typeof UnitsOfTime;
export type UnitOfTime = UnitsOfTimeType[number];

const str: unknown = undefined;
console.log(UnitsOfTime.includes(str as UnitOfTime));

// http://hl7.org/fhir/R4B/valueset-days-of-week.html
export const DaysOfWeek = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
] as const;
type DaysOfWeekType = typeof DaysOfWeek;
export type DayOfWeek = DaysOfWeekType[number];

export type TimeOfDay = string; // No 24:00

// http://hl7.org/fhir/R4B/codesystem-event-timing.html
// http://hl7.org/fhir/R4B/valueset-event-timing.html
export const WhenCodes = [
  'MORN',
  'MORN.early',
  'MORN.late',
  'NOON',
  'AFT',
  'AFT.early',
  'AFT.late',
  'EVE',
  'EVE.early',
  'EVE.late',
  'NIGHT',
  'PHS',
  'IMD', // not in other enum, is FHIR 5.0
  'HS',
  'WAKE',
  'C',
  'CM',
  'CD',
  'CV',
  'AC',
  'ACM',
  'ACD',
  'ACV',
  'PC',
  'PCM',
  'PCD',
  'PCV',
] as const;
type WhenCodesType = typeof WhenCodes;
export type WhenCode = WhenCodesType[number];

export type Duration = {
  value: Decimal;
  unit: UnitOfTime;
};

export type Period = {
  start?: Date;
  end?: Date;
};

export type Range = {
  low?: Duration;
  high?: Duration;
};

export type Repeat = {
  boundsDuration?: Duration;
  boundsPeriod?: Period;
  boundsRange?: Range;
  count?: PositiveInt;
  countMax?: PositiveInt;
  duration?: Decimal;
  durationMax?: Decimal;
  durationUnit?: UnitOfTime;
  frequency?: PositiveInt;
  frequencyMax?: PositiveInt;
  period?: Decimal;
  periodMax?: Decimal;
  periodUnit?: UnitOfTime;
  dayOfWeek?: DayOfWeek[];
  timeOfDay?: TimeOfDay[];
  when?: WhenCode[];
  offset?: UnsignedInt;
};

// Experiment: Implement rules of Timing structure
interface AltRepeatBase {
  bounds?: Duration | Period | Range;
  count?: {
    value: PositiveInt;
    max?: PositiveInt;
  };
  duration?: {
    value: Decimal;
    max?: Decimal;
    unit: UnitOfTime;
  };
  frequency?: {
    value: PositiveInt;
    max?: PositiveInt;
  };
  period?: {
    value: Decimal;
    max?: Decimal;
    unit: UnitOfTime;
  };
  dayOfWeek?: DayOfWeek[];
}

interface AltRepeatTimeOfDay extends AltRepeatBase {
  timeOfDay: TimeOfDay[];
  when?: never;
}

interface AltRepeatWhen extends AltRepeatBase {
  timeOfDay?: never;
  when: { value: WhenCode[]; offset?: UnsignedInt };
}

interface AltRepeatEmpty extends AltRepeatBase {
  timeOfDay?: never;
  when?: never;
}

type AltRepeat = AltRepeatTimeOfDay | AltRepeatWhen | AltRepeatEmpty;

const value: AltRepeat = {
  count: {
    value: 4,
  },
  //timeOfDay: ['23:49:13'],
  when: {
    value: ['AC'],
  },
};
