const instructions = {
  NOP(CPU) {
    console.log(`NOP`); // Print instruction
    CPU.PC++;
  },

  STA(CPU) {
    const address = CPU.memory.read(CPU.nextAddress);
    console.log(`STA ${address}`); // Print instruction
    CPU.memory.write(address, CPU.AC);
    CPU.PC += 2;
    interface.updateMemoryRow(address, CPU.memory, CPU.mnemonics);
  },

  LDA(CPU) {
    const address = CPU.memory.read(CPU.nextAddress);
    console.log(`LDA ${address}`); // Print instruction
    CPU.AC = CPU.memory.read(address);
    CPU.PC += 2;
  },

  ADD(CPU) {
    const address = CPU.memory.read(CPU.nextAddress);
    console.log(`ADD ${address}`); // Print instruction
    CPU.AC = CPU.AC + CPU.memory.read(address);
    CPU.PC += 2;
  },

  OR(CPU) {},

  AND(CPU) {},

  NOT(CPU) {
    console.log(`NOT`); // Print instruction
    CPU.AC = ~CPU.AC;
    CPU.PC++;
  },

  JMP(CPU) {
    const address = CPU.memory.read(CPU.nextAddress);
    console.log(`JMP ${address}`); // Print instruction
    CPU.PC = address;
  },

  JN(CPU) {},

  JZ(CPU) {},

  HLT(CPU) {
    console.log(`HLT`); // Print instruction
    CPU.stopRunning = true;
  },
};
