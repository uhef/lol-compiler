// TODO:
// # Implement Source using streams that will implement the interface Source on page 18.
//   ## The readable stream with the source should be in paused (or pull) mode. Make sure that you don't add `data` event handler to keep the readable stream in paused mode.
//   ## Verify that the readable stream `readableObjectMode` is `false`. The Source class is not able to handle object mode readable streams.

// TODO: First test:
//   - With input "A"
//     - Source should return "A" when currentChar is called.
//     - When nextChar is called Source should return EOL.
