const instructions = document.querySelector(".instructions tbody");
const data = document.querySelector(".data tbody");

function startMemoryUI() {
  for (let i = 0; i <= 255; i++) {
    if (i < 128) {
      instructions.innerHTML += `
            <tr>
              <td>${i}</td>
              <td>${CPU.memory[i]}</td>
              <td>${getKeyByValue(mnemonics, CPU.memory[i]) || "---"}</td>
            </tr>
          `;
    } else {
      data.innerHTML += `
            <tr>
              <td>${i}</td>
              <td>${CPU.memory[i]}</td>
            </tr>
          `;
    }
  }
}

let memoryUI;
function updateMemoryUI(address) {
  memoryUI[address].children[1].innerText = CPU.memory[address];
  if (address <= 127) {
    memoryUI[address].children[2].innerText =
      getKeyByValue(mnemonics, CPU.memory[address]) || "---";
  }
}

const [negativeFlag, zeroFlag] = document.querySelectorAll(".flag");
function updateFlagsUI() {
  negativeFlag.classList.toggle("actived", CPU.N === 1);
  zeroFlag.classList.toggle("actived", CPU.Z === 1);
}

document.querySelector("#reset").addEventListener("click", reset);
document.querySelector("#hard-reset").addEventListener("click", hardReset);
document.querySelector("#run").addEventListener("click", run);
document.querySelector("#step").addEventListener("click", step);

document.querySelector(".add-instruction").addEventListener("submit", (e) => {
  e.preventDefault();

  let { address, value } = Object.fromEntries(new FormData(e.target).entries());

  value = value.toUpperCase();

  if (isNaN(value)) {
    if (!mnemonics[value]) {
      return console.log(`Undefined mnemonic ${value}`);
    }

    CPU.memory[address] = mnemonics[value];
    updateMemoryUI(address);

    e.target[0].value = parseInt(address) + 1;
    e.target[1].value = memoryUI[parseInt(address) + 1].children[1].innerText;
  } else {
    if (value > 255) {
      return console.log(`Max value is 255`);
    }

    CPU.memory[address] = parseInt(value);
    updateMemoryUI(address);

    e.target[0].value = parseInt(address) + 1;
    e.target[1].value = memoryUI[parseInt(address) + 1].children[1].innerText;
  }

  e.target[1].focus();
  e.target[1].select();
});

document.querySelector(".add-data").addEventListener("submit", (e) => {
  e.preventDefault();

  let { address, value } = Object.fromEntries(new FormData(e.target).entries());

  if (isNaN(value)) {
    return console.log(`Not a number: ${value}`);
  } else {
    if (value > 255) {
      return console.log(`Max value is 255`);
    }

    CPU.memory[address] = parseInt(value);
    updateMemoryUI(address);

    e.target[0].value = parseInt(address) + 1;
    e.target[1].value = memoryUI[parseInt(address) + 1].children[1].innerText;
  }

  e.target[1].focus();
  e.target[1].select();
});

const [AC_UI, PC_UI] = document.querySelectorAll(".values div span");
function updateRegisters() {
  AC_UI.innerText = CPU.AC;
  PC_UI.innerText = CPU.PC;
}

function updateCurrentAddress(old, current) {
  memoryUI[old].classList.remove("pc");
  if (!current || current > 255) return;
  memoryUI[current].classList.add("pc");
}

(function init() {
  startMemoryUI();
  updateFlagsUI();
  updateRegisters();
  memoryUI = document.querySelectorAll("tbody tr");
})();
