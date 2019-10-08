import test from "ava";
import { createReadStream } from "fs";
import { Readable } from "stream";
import { Source } from "../../src/frontend/Source";

test("File can be read using stream", async t => {
  const chunks: any[] = [];
  const inputStream = createReadStream("ts_build/src/cli/ArgumentList.js");

  const readChunk = () => {
    const chunk = inputStream.read();
    if (chunk) {
      chunks.push(chunk);
      setTimeout(readChunk, 1);
    }
  };

  const p = new Promise<any[]>((resolve, reject) => {
    inputStream.on("readable", () => {
      setTimeout(readChunk, 1);
    });

    inputStream.on("end", () => {
      resolve(chunks);
    });
  });

  const data = await p;
  t.is(data.length, 1);
  const c = data[0];
  console.log(typeof c);
  console.log(c instanceof Buffer);
  for (let i = 0; i < 20; ++i) {
    if (c[i] === 0x000a) {
      console.log("EOL!");
    }
    console.log(c[i]);
  }
});

test("currentChar followed by nextChar consumes source", async t => {
  const inStream = new Readable({
    // tslint:disable-next-line:no-empty
    read() {}
  });
  inStream.push("A");
  inStream.push(null);
  const source = new Source(inStream);
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
  const source = new Source(inStream);
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
  const source = new Source(inStream);
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
  const source = new Source(inStream);
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
  const source = new Source(inStream);
  t.is(await source.nextChar(), "A".charCodeAt(0));
  t.is(await source.nextChar(), "B".charCodeAt(0));
  t.is(await source.nextChar(), "C".charCodeAt(0));
  t.is(await source.nextChar(), null);
});

//"use strict";␊