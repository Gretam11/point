export interface PaintSettings {
  stepPauseTime: number;
  spreadingFn: AvailableSpreadingFunction;
  isCssAnimationsActive: boolean;
}

export enum AvailableSpreadingFunction {
  lines = 'Lines',
  diamonds = 'Diamonds',
}

export const defaultPaintSettings = {
  stepPauseTime: 50,
  spreadingFn: AvailableSpreadingFunction.lines,
  isCssAnimationsActive: true,
};
