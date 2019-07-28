import test, { ExecutionContext } from "ava";
import { ArgumentList } from "../../src/cli/ArgumentList";

function validationFails(t: ExecutionContext, cliArguments: string[]) {
  const argumentList = new ArgumentList(cliArguments);
  t.false(argumentList.isValid());
}

test("Validation fails with too few argument", validationFails, [
  "one",
  "two",
  "three"
]);
test("Validation fails with too many argument", validationFails, [
  "one",
  "two",
  "three",
  "four",
  "five"
]);
test("Validation fails with invalid operation", validationFails, [
  "one",
  "two",
  "invalidOperation",
  "four"
]);

test("Argument list can parse valid operation", t => {
  const input = ["one", "two", "compile", "source.js"];
  const argumentList = new ArgumentList(input);
  t.true(argumentList.isValid());
  t.is(argumentList.getOperation(), "compile");
});
