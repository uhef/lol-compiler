export enum Operation {
  Compile = "compile",
  Execute = "execute"
}

export type ProcessorMap = {
  [index in Operation]: any;
};
