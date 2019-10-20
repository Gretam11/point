export interface Settings {
  engine: AvailableGridEngine;
  gridSizeX: number;
  gridSizeY: number;
  spreadingSpeed: number;
  spreadingFn: AvailableSpreadingFunction;
}

export enum AvailableGridEngine {
  angular = 'Angular Grid Engine',
  custom = 'Custom Grid Engine',
}

export enum AvailableSpreadingFunction {
  lines = 'Lines',
  diamond = 'Diamonds',
}

export const defaultSettings: Settings = {
  engine: AvailableGridEngine.angular,
  gridSizeX: 60,
  gridSizeY: 30,
  spreadingSpeed: 50,
  spreadingFn: AvailableSpreadingFunction.lines,
};
