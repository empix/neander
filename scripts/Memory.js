class Memory {
  constructor() {
    this._values = new Array(256).fill(0);
  }

  read(address) {
    this.verifyAddress(address);
    return this._values[address];
  }

  write(address, value) {
    this.verifyAddress(address);
    if (value > 0b11111111) {
      throw new Error("The value is greater than 1 byte");
    }

    this._values[address] = value;
  }

  clear(start, end) {
    start = start || 0;
    end = end + 1 || this._values.length;

    this._values.fill(0, start, end);
  }

  verifyAddress(address) {
    if (address > 255) {
      throw new RangeError("Offset is outside the bounds of the memory array");
    }
  }
}
