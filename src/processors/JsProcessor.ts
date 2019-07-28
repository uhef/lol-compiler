import { ProcessorMap } from "../operations";

export const processors: ProcessorMap = {
  compile,
  execute
};

function compile() {
  console.log("compiling javascript source code.");
}

function execute() {
  console.log("executing javascript source code.");
}
