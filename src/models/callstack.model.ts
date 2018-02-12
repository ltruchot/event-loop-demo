export interface IEventLoop {
  callStack: IStackFunction[];
  readyStack: IStackFunction[];
  level: number;
  parent: IStackFunction;
}

export interface IStackFunction {
  parent: IStackFunction;
  name: string;
  func: Function;
}
