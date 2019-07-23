class ArgumentList {
  private arguments: string[];

  constructor(cliArgs: string[]) {
    this.arguments = cliArgs;
  }

  isValid() {
    return this.arguments && this.arguments.length === 4;
  }
}

function printUsage() {
  console.log("Usage: npm start <compile|execute> <source.js>");
}

const argumentList = new ArgumentList(process.argv);
if (argumentList.isValid()) {
  console.log("compiling/executing");
} else {
  printUsage();
  process.exit(1);
}
