import { Buffer } from "buffer";

class LazyBuffer {
    constructor(size) {
        this.size = size;
        this.buffer = null;
        this.currentState = new IdleBuffer(this);

        for(const prop in Buffer.prototype) {
            if(typeof Buffer.prototype[prop] !== 'function') {
                continue;
            }

            // Forward all functions call to the current state which is dynamic
            this[prop] = (...args) => {
                this.currentState[prop](...args);
            }
        }
    }

}

class IdleBuffer {
    constructor(lazyBuffer) {
        this.lazyBuffer = lazyBuffer;
        for(const prop in Buffer.prototype) {
            if(typeof Buffer.prototype[prop] !== 'function') {
                continue;
            }

            if(prop === 'write') {
                continue;
            }

            this[prop] = function () {

            }
        }
    }

    write(...args) {
        const buffer = Buffer.alloc(this.lazyBuffer.size);
        buffer.write(...args);
        this.lazyBuffer.buffer = buffer;
        this.lazyBuffer.currentState = new ActiveBuffer(this.lazyBuffer);
    }
}

class ActiveBuffer {
    constructor(lazyBuffer) {
        this.lazyBuffer = lazyBuffer;
        for (const prop in Buffer.prototype) {
            if(typeof lazyBuffer.buffer[prop] !== 'function') {
                continue;
            }

            this[prop] = function(...args) {
                Buffer.prototype[prop].apply(this.lazyBuffer.buffer, args);
            }
        }
    }
}


export default function createLazyBuffer(size) {
    return new LazyBuffer(size);
}
