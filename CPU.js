const CPU = {
  AC: 0, // Accumulator
  PC: 0, // Program Counter
  N: 0, // Flag Negative
  Z: 1, // Flag Zero
  stop: 0, // If is to stop
  memory: Array(256).fill(0), // 256 Bytes
  instructions: {},
};

CPU.instructions = {
  0: () => {
    // NOP
    updateCurrentAddress(CPU.PC, CPU.PC + 1);

    CPU.PC++;
  },
  16: () => {
    // STA
    updateCurrentAddress(CPU.PC, CPU.PC + 2);

    const address = CPU.memory[CPU.PC + 1];
    CPU.memory[address] = CPU.AC;
    CPU.PC += 2;

    updateMemoryUI(address);
  },
  32: () => {
    // LDA
    updateCurrentAddress(CPU.PC, CPU.PC + 2);

    CPU.AC = CPU.memory[CPU.memory[CPU.PC + 1]];
    CPU.PC += 2;
  },
  48: () => {
    // ADD
    updateCurrentAddress(CPU.PC, CPU.PC + 2);

    CPU.AC = CPU.AC + CPU.memory[CPU.memory[CPU.PC + 1]];
    CPU.PC += 2;
  },
  64: () => {
    // OR
  },
  80: () => {
    // AND
  },
  96: () => {
    // NOT
    updateCurrentAddress(CPU.PC, CPU.PC + 1);

    CPU.AC = ~CPU.AC;
    CPU.PC++;
  },
  128: () => {
    // JMP
  },
  144: () => {
    // JN
  },
  160: () => {
    // JZ
  },
  240: () => {
    // HLT
    CPU.stop = 1;
  },
};

const mnemonics = {
  NOP: 0,
  STA: 16,
  LDA: 32,
  ADD: 48,
  OR: 64,
  AND: 80,
  NOT: 96,
  JMP: 128,
  JN: 144,
  JZ: 160,
  HLT: 240,
};

function updateFlags() {
  CPU.N = CPU.AC < 0 ? 1 : 0;
  CPU.Z = CPU.AC == 0 ? 1 : 0;

  updateFlagsUI();
}

function reset() {
  updateCurrentAddress(CPU.PC, null);

  CPU.AC = 0;
  CPU.PC = 0;
  CPU.N = 0;
  CPU.Z = 1;
  CPU.stop = 0;

  updateRegisters();
  updateFlagsUI();
}

function hardReset() {
  reset();
  CPU.memory = Array(256).fill(0);
  CPU.memory.forEach((value, address) => updateMemoryUI(address));
}

function step() {
  if (isNaN(CPU.memory[CPU.PC])) {
    if (mnemonics[CPU.memory[CPU.PC]]) {
      return console.log(`Undefined mnemonic ${CPU.memory[CPU.PC]}`);
    }

    CPU.instructions[mnemonics[CPU.memory[CPU.PC]]]();
  } else {
    if (!CPU.instructions[CPU.memory[CPU.PC]]) {
      console.log(`Undefined instruction ${CPU.memory[CPU.PC]}`);
      CPU.instructions[mnemonics["NOP"]]();
      return;
    }

    CPU.instructions[CPU.memory[CPU.PC]]();
  }

  updateFlags();
  updateRegisters();
}

function run() {
  CPU.stop = 0;

  for (let i = 0; i <= 255; i++) {
    if (CPU.stop) {
      break;
    }

    step();
  }
}
