import { Readable } from "stream";

// TODO:
// # Implement Source using streams that will implement the interface Source on page 18.
//   ## The readable stream with the source should be in paused (or pull) mode. Make sure that you don't add `data` event handler to keep the readable stream in paused mode.
//   ## Verify that the readable stream `readableObjectMode` is `false`. The Source class is not able to handle object mode readable streams.

// TODO: Should currentChar return EOF after nextChar has returned EOF?
// TODO: Wrap source into async createSource function to allow for reading in the first chunk.

enum InputState {
  Initializing,
  Readable,
  Consumed
}

export class Source {
  private input: Readable;
  private state: InputState = InputState.Initializing;
  private buffer: Buffer | undefined;
  private index: number = -1;
  private readableCb: () => void;

  constructor(i: Readable) {
    this.input = i;
    // tslint:disable-next-line:no-empty
    this.readableCb = () => {};
    this.input.once("readable", () => {
      console.log("readable callback");
      this.state = InputState.Readable;
      this.readableCb();
    });
    this.input.on("end", () => {
      console.log("end callback");
      this.state = InputState.Consumed;
    });
  }

  async currentChar(): Promise<number | null> {
    if (this.index < 0) {
      return this.nextChar();
    } else {
      if (!this.buffer) {
        throw new Error("Internal error - Buffer not read.");
      }
      return this.buffer[this.index];
    }
  }

  async nextChar(): Promise<number | null> {
    const bufferConsumed: boolean =
      !!this.buffer && this.index + 1 >= this.buffer.length;
    console.log("nextChar");

    if (this.state === InputState.Consumed && bufferConsumed) {
      return null;
    }
    if (!this.buffer) {
      this.buffer = await this.commenceReading();
    }
    if (bufferConsumed) {
      this.buffer = await this.readNextChunk();
      this.index++;
      return this.currentChar();
    } else {
      this.index++;
      return this.currentChar();
    }
  }

  async commenceReading(): Promise<Buffer> {
    console.log("commenceReading()");
    if (this.state === InputState.Readable) {
      return this.input.read();
    } else {
      return new Promise((resolve, reject) => {
        this.whenReadable(() => {
          resolve(this.input.read());
        });
      });
    }
  }

  whenReadable(cb: () => void) {
    this.readableCb = cb;
  }

  async readNextChunk(): Promise<Buffer> {
    console.log("readNextChunk()");
    this.index = -1;
    const chunk = this.input.read();
    return chunk ? chunk : [null];
  }
}
