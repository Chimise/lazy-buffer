import createLazyBuffer from "./lazy-buffer.js";

const str = 'chisomchisomchisomchisom';

const lazyBuffer = createLazyBuffer(str.length);

lazyBuffer.readInt8();

lazyBuffer.write(str);

const buffer = Buffer.alloc(str.length);

lazyBuffer.copy(buffer, 0);

console.log(buffer);

console.log(lazyBuffer);

