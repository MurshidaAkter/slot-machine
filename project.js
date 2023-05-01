// 1. Deposit some money
// 2 Determine number of lines to bet on [3 lines]
// 3. Collect a bet amount
// 4. spin the slot machine
// 5. Check if the user won
// 6. give the user their winings
// 7. Play Again

const prompt = require('prompt-sync')(); 
            // to get the user input
            // prompt ==> name of the function 
            // () ==> will give the access to the prompt function 

const ROWS = 3;
const COLS = 3;

const SYMBOL_COUNT = {
    A:2,
    B:4,
    C:6,
    D:8
}  // 6 of C  30:15

const SYMBOL_VALUES = {
    A:5,
    B:4,
    C:3,
    D:2
}  // if i get a/b/c/d it will be multiplied by 5/4/3/2

// -----------------------------
// function deposit() {
//     return 1
// }
// const x = deposit()
// ----------BLOCK 1----------------

const deposit = () => {
    // BLOCK 1
    while (true){
        const depositAmount = prompt("Enter a deposite amount: ");
    // string input in parseFloat ==> NaN
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid deposit amount, try again.")
        }else{
            return numberDepositAmount;
            // will break the infinite while(true) loop
        }
    }
}

const getNumberOfLines = () => {
    // BLOCK 1
    while (true){
        const lines = prompt("Enter the number of lines to bet on (1 - 3): ");
    // string input in parseFloat ==> NaN
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3){
            console.log("Invalid line number, try again.")
        }else{
            return numberOfLines;
            // will break the infinite while(true) loop
        }
    }
}

const getBet = (balance, numberOfLines) => {
    while (true){
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / numberOfLines){
            console.log("Invalid line number, try again.")
        }else{
            return numberBet;
        }
    }
}

const spin = () =>{
    // Will generate the reels
    const symbols = [];
    for (const [symbol,count] of Object.entries(SYMBOL_COUNT)){
                //[symbol(A),count(2)] ==> 2 counters for object
        for (let i = 0; i<count; i++){
            symbols.push(symbol);
        }
    }
    // [ [ 'D', 'D', 'C' ], [ 'C', 'B', 'A' ], [ 'D', 'C', 'C' ] ]
    const reels = [];
    for (let i = 0; i < COLS; i++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j=0; j<ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

// [[A B C], [D D D], [A A A]]
// ==> Transposing the array
//                     [A D A]
//                     [B D A]
//                     [C D A]
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++){
        rows.push([]);
        for (let j = 0; j< COLS; j++){
            rows[i].push(reels[j][i])
        }
    }
    return rows
    // rows ==> [ [ 'D', 'C', 'C' ], [ 'A', 'B', 'C' ], [ 'D', 'C', 'B' ] ]
}

// funtion to show the users what they spun:
const printRows = (rows) =>{
    for (const row of rows){  // row ==> [ 'D', 'C', 'C' ]
        let rowString = "";  // "D | C | C" ==> output
        for (const [i,symbol] of row.entries()){  //row.entries i=0,1,2 || symbol= D ,C ,C
            rowString += symbol;
            if (i != row.length -1){ // pipe operator only if the element isnt last.
                rowString += " | "
            }
        }
        console.log(rowString)
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols){
            if (symbol != symbols[0]){
                allSame = false;
                break;
            }
        }
        if (allSame){
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
}

const game = () => {
    let balance = deposit();
    while(true){
        console.log("You have balance of $"+ balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet*numberOfLines;
    
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winings = getWinnings(rows, bet, numberOfLines);

        balance += winings;
        console.log("You won, $" + winings.toString());

        if (balance <= 0){
            console.log("You ran out of money!");
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n) ")

        if (playAgain != "y") break;
    }
}

game();
