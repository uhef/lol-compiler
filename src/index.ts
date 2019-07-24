import { compile, execute } from "./processors/JsProcessor";

enum Operation {
  Compile = "compile",
  Execute = "execute"
}

type ProcessorMap = {
  [index in Operation]: any;
};

const processors: ProcessorMap = {
  compile,
  execute
};

class ArgumentList {
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

function printUsage() {
  console.log("Usage: npm start <compile|execute> <source.js>");
}

const argumentList = new ArgumentList(process.argv);
if (argumentList.isValid()) {
  const processor = processors[argumentList.getOperation()];
  processor();
} else {
  printUsage();
  process.exit(1);
}
