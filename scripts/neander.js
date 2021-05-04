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
