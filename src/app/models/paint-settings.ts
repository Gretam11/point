export interface PaintSettings {
  stepPauseTime: number;
  spreadingFn: AvailableSpreadingFunction;
}

export enum AvailableSpreadingFunction {
  lines = 'Lines',
  diamonds = 'Diamonds',
}

export const defaultPaintSettings = {
  stepPauseTime: 50,
  spreadingFn: AvailableSpreadingFunction.lines,
};
