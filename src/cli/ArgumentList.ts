import { Operation } from "../operations";

export class ArgumentList {
  private arguments: string[];

  constructor(cliArgs: string[]) {
    this.arguments = cliArgs;
  }

  isValidOperation(operation: string): boolean {
    return Object.values(Operation).some(o => o === operation);
  }

  isValid(): boolean {
    return (
      this.arguments &&
      this.arguments.length === 4 &&
      this.isValidOperation(this.operationArgument())
    );
  }

  getOperation(): Operation {
    const operations = Object.values(Operation);
    return operations.find(o => o === this.operationArgument());
  }

  private operationArgument(): string {
    return this.arguments[2];
  }
}
