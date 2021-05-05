class CPU {
  constructor() {
    this.memory = new Memory();

    this.AC = 0;
    this.PC = 0;
    this.N = 0;
    this.Z = 1;

    this.stopRunning = false;

    this.mnemonics = {
      0: "NOP",
      16: "STA",
      32: "LDA",
      48: "ADD",
      64: "OR",
      80: "AND",
      96: "NOT",
      128: "JMP",
      144: "JN",
      160: "JZ",
      240: "HLT",
    };

    this.observers = [];
  }

  get nextAddress() {
    return this.PC + 1;
  }

  execute(opcode) {
    const instruction = this.mnemonics[opcode];

    if (!instruction) {
      return console.log(`Invalid opcode: ${opcode}`);
    }

    instructions[instruction](this);
  }

  updateFlags() {
    this.N = this.AC < 0 ? 1 : 0;
    this.Z = this.AC == 0 ? 1 : 0;
  }

  reset() {
    this.AC = 0;
    this.PC = 0;
    this.N = 0;
    this.Z = 1;

    this.stopRunning = false;
    this.notifyObservers(this);
  }

  hardReset() {
    this.memory.clear();
    hardResetUI();
  }

  step() {
    this.execute(this.memory.read(this.PC));
    this.updateFlags();

    this.notifyObservers(this);
  }

  run() {
    const interval = setInterval(() => {
      if (this.stopRunning || this.PC > 255) {
        return clearInterval(interval);
      }

      this.step();
    }, 1);
    // let i = 0;
    // while (!this.stopRunning && this.PC < 256 && i < 512) {
    //   this.step();
    //   i++;
    // }
  }

  subscribeObserver(observerFuncion) {
    this.observers.push(observerFuncion);
  }

  notifyObservers(data) {
    this.observers.forEach((func) => {
      func(data);
    });
  }
}
