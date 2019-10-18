import test from "ava";
import { Readable } from "stream";
import { createSource } from "../../src/frontend/Source";

test("currentChar followed by nextChar consumes source", async t => {
  const inStream = new Readable({
    // tslint:disable-next-line:no-empty
    read() {}
  });
  inStream.push("A");
  inStream.push(null);
  const source = await createSource(inStream);
  t.is(await source.currentChar(), "A".charCodeAt(0));
  t.is(await source.nextChar(), null);
});

test("nextChar followed by nextChar consumes source", async t => {
  const inStream = new Readable({
    // tslint:disable-next-line:no-empty
    read() {}
  });
  inStream.push("A");
  inStream.push(null);
  const source = await createSource(inStream);
  t.is(await source.nextChar(), "A".charCodeAt(0));
  t.is(await source.nextChar(), null);
});

test("nextChar, currentChar, nextChar consumes source", async t => {
  const inStream = new Readable({
    // tslint:disable-next-line:no-empty
    read() {}
  });
  inStream.push("A");
  inStream.push(null);
  const source = await createSource(inStream);
  t.is(await source.nextChar(), "A".charCodeAt(0));
  t.is(await source.currentChar(), "A".charCodeAt(0));
  t.is(await source.nextChar(), null);
});

test("currentChar, currentChar, nextChar consumes source", async t => {
  const inStream = new Readable({
    // tslint:disable-next-line:no-empty
    read() {}
  });
  inStream.push("A");
  inStream.push(null);
  const source = await createSource(inStream);
  t.is(await source.currentChar(), "A".charCodeAt(0));
  t.is(await source.currentChar(), "A".charCodeAt(0));
  t.is(await source.nextChar(), null);
});

test("read over buffer boundary", async t => {
  const data = ["A", "B", "C"];
  let index = 0;
  const inStream = new Readable({
    read() {
      if (index < data.length) {
        this.push(data[index]);
        index++;
      } else {
        this.push(null);
      }
    }
  });
  const source = await createSource(inStream);
  t.is(await source.nextChar(), "A".charCodeAt(0));
  t.is(await source.nextChar(), "B".charCodeAt(0));
  t.is(await source.nextChar(), "C".charCodeAt(0));
  t.is(await source.nextChar(), null);
});
