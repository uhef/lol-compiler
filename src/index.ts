import { ArgumentList } from "./cli/ArgumentList";
import { processors } from "./processors/JsProcessor";

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
