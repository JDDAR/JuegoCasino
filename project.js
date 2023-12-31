// 1. Depositar algo de dinero
// 2. Determinar el número de líneas a apostar
// 3. cobrar una cantidad de apuesta
// 4. girar la máquina tragamonedas
// 5. verifique la identificación que ganó el usuario
// 6. dar al usuario sus ganancias
// 7. jugar de nuevo

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  "A": 2,
  "B": 4,
  "C": 6,
  "D": 8
}

const SYMBOLS_VALUES = {
  "A": 5,
  "B": 4,
  "C": 3,
  "D": 2
}

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Ingrese un monto de depósito: ");  // Pedir al usuario que ingrease un monto de deposito
    const numberDepositAmount = parseFloat(depositAmount); // cponvertir el string ingresado en numero con la funcion de paseFloat  "1254" -> 1254;
    
    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Monto de depósito no válido, inténtalo de nuevo.")
    } else {
      return numberDepositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3) ");
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("Introduce el número de líneas a apostar ")
    } else {
      return numberOfLines;
    }
  }
}

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Introduzca la apuesta por línea: ");
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > (balance / lines)) {
      console.log("Apuesta no válida, inténtalo de nuevo.")
    } else {
      return numberBet;
    }
  }
}

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const ramdomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[ramdomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(ramdomIndex, 1);
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i])
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = " ";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winnings += bet * SYMBOLS_VALUES[symbols[0]];

    }
  }
  return winnings;
}


const game = () => {
  let balance = deposit();

  while (true) {
    console.log("tienes un saldo de $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log("ganaste, $" + winnings.toString());

    if (balance <= 0) {
      console.log("Te quedaste sin dinero ");
      break;
    }
    const playAgain = prompt("Quieres jugar de nuevo (y/n)? ");
    if (playAgain != "y") break;

  }
}
game();