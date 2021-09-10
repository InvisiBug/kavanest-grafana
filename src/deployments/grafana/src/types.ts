export type Sensors = {
  livingRoom: Sensor;
  kitchen: Sensor;
  liamsRoom: Sensor;
  study: Sensor;
  ourRoom: Sensor;
};

export type Sensor = {
  temperature: undefined | number;
  humidity: undefined | number;
};

export type Heating = {
  heatingState: number | undefined;
};

export type TemperatureOffsets = {
  "Living Room": number;
  Kitchen: number;
  "Liams Room": number;
  Study: number;
  "Our Room": number;
};

export type Valves = {
  livingRoom: { state: number };
  liamsRoom: { state: number };
  study: { state: number };
  ourRoom: { state: number };
};

export type TimerType = NodeJS.Timeout;
