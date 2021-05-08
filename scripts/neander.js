/* Start CPU and UI */
const interface = new UI();
const neander = new CPU();

neander.subscribeObserver(({ AC, PC, N, Z }) => {
  interface.updateCurrentPC(PC);
  interface.updateRegisters(AC, PC);
  interface.updateFlags(N, Z);
});

interface.startTables(neander.memory, neander.mnemonics);
interface.initControls(neander);

neander.notifyObservers(neander);

function hardResetUI() {
  interface.resetMemory(neander.memory, neander.mnemonics);
}

/* Assembler */
const textarea = document.querySelector("textarea");
const editor = CodeMirror.fromTextArea(textarea, {
  lineNumbers: true,
  styleActiveLine: true,
  placeholder: "Write assembly here",
  theme: "dracula",
  lineNumberFormatter: (line) => line - 1,
});

/* MNEMONIC: [opcode, bytes] */
const mnemonics = {
  NOP: [0, 1],
  STA: [16, 2],
  LDA: [32, 2],
  ADD: [48, 2],
  OR: [64, 0],
  AND: [80, 0],
  NOT: [96, 1],
  JMP: [128, 2],
  JN: [144, 2],
  JZ: [160, 2],
  HLT: [240, 1],
};

document.querySelector("#set-assembly").addEventListener("click", () => {
  const instructions = editor
    .getValue(" ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()
    .split(" ");

  const decodedInstructions = decodeInstructions(instructions);

  neander.memory.clear(0, 127);

  decodedInstructions.forEach((value, index) => {
    neander.memory.write(index, value);
  });

  interface.resetMemory(neander.memory, neander.mnemonics);
});

function decodeInstructions(instructions) {
  const result = [];

  for (let i = 0; i < instructions.length; i++) {
    const [opcode, bytes] = mnemonics[instructions[i]] || [0, 0];

    if (!opcode) {
      throw new Error(`Invalid mnemonic: ${instructions[i]}`);
    }

    result[i] = opcode;
    if (bytes === 2) {
      if (isNaN(instructions[i + 1])) {
        throw new Error(`Invalid memory address: ${instructions[i + 1]}`);
      }

      result[++i] = parseInt(instructions[i]);
    }
  }

  return result;
}
