let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const purchaseBtn = document.getElementById('purchase-btn');
const cash = document.getElementById('cash');
const changeDue = document.getElementById('change-due');
const cidContainer = document.getElementById("cid");
const priceContainer = document.getElementById("price");

//showing price 
priceContainer.textContent = `Price: $${price}`;
priceContainer.style.display = "block";

//showing cid 
cidContainer.style.display = "flex";
cidContainer.style.flexDirection = "column";

for (let i = 0; i < cid.length; i++) {
    const denomination = cid[i][0];
    const amount = cid[i][1];

    const p = document.createElement('p');
    p.textContent = `${denomination}: $${amount}`;

    cidContainer.appendChild(p);
};

//I need to automate the process rather than having static replies for the user based on the cash they give.

//function to calculate change 
const calculateChange = (changeAmount, availableCID) => {
    const currencyValues = [
        ['ONE HUNDRED', 100],
        ['TWENTY', 20],
        ['TEN', 10],
        ['FIVE', 5],
        ['ONE', 1],
        ['QUARTER', 0.25],
        ['DIME', 0.1],
        ['NICKEL', 0.05],
        ['PENNY', 0.01]
    ];

    let changeGiven = [];
    let remainingChange = changeAmount;
    let cidIndex;

    for (let [currencyName, currencyValue] of currencyValues) {
        cidIndex = availableCID.findIndex(item => item[0] === currencyName);
        let availableCurrency = availableCID[cidIndex][1];
        let currencyCount = 0;
        let currencyTotal = 0;

        while (remainingChange >= currencyValue && availableCurrency > 0) {
            remainingChange = (Math.round((remainingChange - currencyValue) * 100)) / 100;
            availableCurrency = (Math.round((availableCurrency - currencyValue) * 100)) / 100;
            currencyCount++;
            currencyTotal = currencyCount * currencyValue;
        }

        if (currencyCount > 0) {
            changeGiven.push([currencyName, currencyTotal]);
            availableCID[cidIndex][1] = availableCurrency; // Update CID correctly
        }
    }

    if (remainingChange > 0) {
        return { status: 'INSUFFICIENT_FUNDS', change: [] };
    }

    // Check if CID is empty
    let totalCid = availableCID.reduce((acc, curr) => acc + curr[1], 0);
    if (totalCid === 0) {
        return { status: 'CLOSED', change: changeGiven };
    }

    return { status: 'OPEN', change: changeGiven };
};

// Button
purchaseBtn.addEventListener('click', () => {
  const cashValue = parseFloat(cash.value);
  const priceValue = parseFloat(price);

  if (cashValue < priceValue){
    alert("Customer does not have enough money to purchase the item");
  }
  else if (cashValue === priceValue){
    changeDue.textContent = "No change due - customer paid with exact cash";
    changeDue.style.display ='block';
  }
  else{
    let change = cashValue - priceValue;
    let changeResult = calculateChange(change, cid);

    if (changeResult.status === "INSUFFICIENT_FUNDS"){
      changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
      changeDue.style.display = "block";
    }
    //display the change
    else {
      let changeString = "Status: " + changeResult.status;
      for (let changeDenomination of changeResult.change){
        changeString += ' ' + changeDenomination[0] + ": $" + changeDenomination[1];
      }
      changeDue.textContent = changeString;
      changeDue.style.display = 'block';
    }
  }  

});

