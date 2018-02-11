export interface IEventLoop {
  callStack: IStackFunction[];
  readyStack: IStackFunction[];
  isRunning: boolean;
  level: number;
  parent: IStackFunction;
}

export interface IStackFunction {
  parent: IStackFunction;
  name: string;
  func: Function;
}
