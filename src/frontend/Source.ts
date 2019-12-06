import { Readable } from "stream";

// TODO:
// # Implement Source using streams that will implement the interface Source on page 18.
//   ## The readable stream with the source should be in paused (or pull) mode. Make sure that you don't add `data` event handler to keep the readable stream in paused mode.
//   ## Verify that the readable stream `readableObjectMode` is `false`. The Source class is not able to handle object mode readable streams.

enum InputState {
  Initializing,
  Readable,
  Consumed
}

class Source {
  private input: Readable;
  private state: InputState = InputState.Readable;
  private buffer: Buffer;
  private index: number = -1;

  constructor(i: Readable, b: Buffer) {
    this.input = i;
    this.buffer = b;
    this.input.on("end", () => {
      this.state = InputState.Consumed;
    });
  }

  markStreamConsumed() {
    this.state = InputState.Consumed;
    this.buffer = Buffer.from([]);
  }

  async currentChar(): Promise<number | null> {
    if (this.index < 0) {
      return this.nextChar();
    } else {
      if (!this.buffer) {
        throw new Error("Internal error - Buffer not read.");
      }
      const char = this.buffer[this.index];
      return char ? char : null;
    }
  }

  async nextChar(): Promise<number | null> {
    const bufferConsumed: boolean =
      !!this.buffer && !this.buffer[this.index + 1];
    this.index++;
    if (this.state === InputState.Consumed && bufferConsumed) {
      return null;
    }
    if (bufferConsumed) {
      await this.readNextChunk();
      return this.currentChar();
    } else {
      return this.currentChar();
    }
  }

  async readNextChunk(): Promise<void> {
    this.index = -1;
    const chunk = await this.input.read();
    if (chunk) {
      this.buffer = chunk;
    } else {
      this.markStreamConsumed();
    }
  }
}

export async function createSource(input: Readable): Promise<Source> {
  return new Promise(resolve => {
    const buffer = input.read();
    input.once("readable", () => {
      resolve(new Source(input, buffer));
    });
  });
}
