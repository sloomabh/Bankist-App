"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
  ],
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
/************************************************* */
// Display movements:
/***************************************** */
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ""; // empty the container

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements; //we took a copy (sloce methode or spread operator) for the array to sort it

  movs.forEach(function (element, index) {
    const type = element > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[index]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0); // zero based
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    console.log(date);
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    }  ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value"> ${element} €</div>
        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html); // with beforeend --> the order will change to the invers
  });
};

/*****************************
      Display Balance
************************************/

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur) {
    return acc + cur; //we return the accumulator
  }, 0);

  labelBalance.textContent = `${acc.balance} €`;
};

/*****************************
      Display Summary
************************************/
const calcDisplaySummary = function (acc) {
  const incoms = acc.movements
    .filter((val) => val > 0)
    .reduce((acc, curr) => acc + curr);

  labelSumIn.textContent = `${incoms}€`;

  const outcoms = acc.movements
    .filter((val) => val < 0)
    .reduce((acc, curr) => acc + curr);

  labelSumOut.textContent = `${-outcoms}€`;

  const interest = (incoms * acc.interestRate) / 100;
  labelSumInterest.textContent = interest;
};

/**************************************** */
//compute the user name
/********************************* */

const CreateUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((val) => val[0]) // or  (val) => {  return val[0]  } )
      .join("");
  });
};
CreateUsernames(accounts);
/******************************************************* */
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};
/*******************************************
 *   Event handlers
 *********************************************/

//***   Login  **********/
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  //prevent form from submitting
  e.preventDefault(); // the default behaviour for the submit button is to reload
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  //optionalchaining if the currentaccount is exist
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back ,${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 1;

    // Create current time and date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0); // zero based
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year} , ${hour}:${min}`;
    //Clear fields
    inputLoginUsername.value = inputLoginPin.value = "";

    // Update UI
    updateUI(currentAccount);
    console.log(currentAccount);
  } else {
    alert("Wrong username or password");
    //Clear fields
    inputLoginUsername.value = inputLoginPin.value = "";
  }
});

/*****  Transfer money */

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
  }
});
/********  TAKE LOAN   *********** */
//because our bank has a rule, which says that it only grants a loan if there at least one deposit with at least 10% of the requested loan amount.

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov > amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
    //Clear fields
    inputLoanAmount.value = inputLoginPin.value = "";
  }
});

/****  DELETE account */

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername?.value === currentAccount.username &&
    Number(inputClosePin?.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    //Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
  console.log(accounts);
});

/******************* SORT movements ********** */
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount, !sorted);
});

/************************** Add the date  ***************/
const a = new Date();
console.log(a);
