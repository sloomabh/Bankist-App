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
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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
const displayMovements = function (movements) {
  containerMovements.innerHTML = ""; // empty the container
  movements.forEach(function (element, index) {
    const type = element > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    }  ${type}</div>
          <div class="movements__date">3 days ago</div>
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
  console.log(outcoms);
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
  displayMovements(acc.movements);
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
    //Clear fields
    inputLoginUsername.value = inputLoginPin.value = "";

    // Update UI
    updateUI(currentAccount);
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
    // Update UI
    updateUI(currentAccount);
  }
});
/********  TAKE LOAN   *********** */
//because our bank has a rule, which says that it only grants a loan if there at least one deposit with at least 10% of the requested loan amount.

btnLoan.addEventListener("click", function (e) {
  console.log("hai");
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
