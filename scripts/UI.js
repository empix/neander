const elementTables = {
  instructions: document.querySelector(".instructions table"),
  data: document.querySelector(".data table"),
};
const elementForms = {
  instructions: document.querySelector(".add-instruction"),
  data: document.querySelector(".add-data"),
};
const elementFlags = {
  negativeFlag: document.querySelector(".n.flag"),
  zeroFlag: document.querySelector(".z.flag"),
};
const elementRegisters = {
  AC: document.querySelector(".registers .ac span"),
  PC: document.querySelector(".registers .pc span"),
};

class UI {
  constructor() {
    this.oldPCHighlight;
    this.memoryRows;
  }

  initControls(neander) {
    document.querySelector("#reset").addEventListener("click", () => {
      neander.reset();
    });
    document.querySelector("#hard-reset").addEventListener("click", () => {
      neander.hardReset();
    });
    document.querySelector("#run").addEventListener("click", () => {
      neander.run();
    });
    document.querySelector("#step").addEventListener("click", () => {
      neander.step();
    });

    elementForms.instructions.addEventListener("submit", (e) => {
      this.addInstruction(e, neander.memory, neander.mnemonics);
    });
    elementForms.data.addEventListener("submit", (e) => {
      this.addData(e, neander.memory, neander.mnemonics);
    });

    elementTables.instructions.addEventListener("click", ({ path }) => {
      this.handleRowClick(elementForms.instructions, path[1]);
    });

    elementTables.data.addEventListener("click", ({ path }) => {
      this.handleRowClick(elementForms.data, path[1]);
    });
  }

  handleRowClick(form, row) {
    if (row?.nodeName != "TR") return;

    const [addressInput, valueInput] = form;
    const addressValue = row.children[1].innerText;

    addressInput.value = row.dataset.address;
    valueInput.value = addressValue;
    valueInput.focus();
    valueInput.select();
  }

  startTables(memory, mnemonics) {
    for (let i = 0; i <= 255; i++) {
      const value = memory.read(i);

      if (i < 128) {
        elementTables.instructions.tBodies[0].innerHTML += `
              <tr data-address="${i}">
                <td>${i}</td>
                <td>${value}</td>
                <td>${mnemonics[value] || "---"}</td>
              </tr>
            `;
      } else {
        elementTables.data.tBodies[0].innerHTML += `
              <tr data-address="${i}">
                <td>${i}</td>
                <td>${value}</td>
              </tr>
            `;
      }
    }

    this.memoryRows = document.querySelectorAll("tbody tr");
  }

  updateFlags(N, Z) {
    elementFlags.negativeFlag.classList.toggle("actived", N === 1);
    elementFlags.zeroFlag.classList.toggle("actived", Z === 1);
  }

  updateRegisters(AC, PC) {
    elementRegisters.AC.innerText = AC;
    elementRegisters.PC.innerText = PC;
  }

  resetMemory(memory, mnemonics) {
    for (let i = 0; i < 256; i++) {
      this.updateMemoryRow(i, memory, mnemonics);
    }
  }

  updateMemoryRow(address, memory, mnemonics) {
    const memoryValue = memory.read(address);

    const valueElement = this.memoryRows[address].children[1];
    valueElement.innerText = memoryValue;

    if (address <= 127) {
      const mnemonicElement = this.memoryRows[address].children[2];
      mnemonicElement.innerText = mnemonics[memoryValue] || "---";
    }
  }

  updateCurrentPC(current) {
    if (this.oldPCHighlight !== undefined) {
      this.memoryRows[this.oldPCHighlight].classList.remove("current-pc");
    }

    if (current < 255) {
      this.memoryRows[current].classList.add("current-pc");
      this.oldPCHighlight = current;
    }
  }

  nextAddressToForm(e, address) {
    const [addressInput, valueInput] = e.target;
    const newAddress = parseInt(address) + 1;
    const addressValue = this.memoryRows[newAddress].children[1].innerText;

    addressInput.value = newAddress;
    valueInput.value = addressValue;
    valueInput.focus();
    valueInput.select();
  }

  addInstruction(e, memory, mnemonics) {
    e.preventDefault();

    let { address, value } = Object.fromEntries(
      new FormData(e.target).entries()
    );

    value = value.toUpperCase();

    if (isNaN(value)) {
      const opcode = getKeyByValue(neander.mnemonics, value);

      if (!opcode) {
        return console.log(`Undefined mnemonic ${value}`);
      }

      neander.memory.write(address, opcode);
      this.updateMemoryRow(address, memory, mnemonics);
    } else {
      if (value > 255) {
        return console.log(`Max value is 255`);
      }

      neander.memory.write(address, parseInt(value));
      this.updateMemoryRow(address, memory, mnemonics);
    }

    this.nextAddressToForm(e, address);
  }

  addData(e, memory, mnemonics) {
    e.preventDefault();

    let { address, value } = Object.fromEntries(
      new FormData(e.target).entries()
    );

    if (isNaN(value)) {
      return console.log(`Not a number: ${value}`);
    } else {
      if (value > 255) {
        return console.log(`Max value is 255`);
      }

      neander.memory.write(address, parseInt(value));
      this.updateMemoryRow(address, memory, mnemonics);
    }

    this.nextAddressToForm(e, address);
  }
}
