export interface GridSettings {
  engine: AvailableGridEngine;
  gridSizeX: number;
  gridSizeY: number;
}

export enum AvailableGridEngine {
  angular = 'Angular Grid Engine',
  custom = 'Custom Grid Engine',
}

export const defaultGridSettings: GridSettings = {
  engine: AvailableGridEngine.angular,
  gridSizeX: 60,
  gridSizeY: 30,
};
