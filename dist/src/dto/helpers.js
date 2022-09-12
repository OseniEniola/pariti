"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresChange = exports.updateCoinChange = exports.getChange = exports.getCoins = exports.updateProductInventory = exports.fromatChange = void 0;
const services_1 = require("../dto/services");
var itemCollection = services_1.db.collection("slotInventory");
var coinCollection = services_1.db.collection("coins");
var salesCollection = services_1.db.collection("sales");
function fromatChange(change) {
    let changeMap = new Map();
    let changeArr = [];
    change.forEach(e => {
        if (changeMap.has(e.toString() + " cents")) {
            let value = changeMap.get(e.toString() + " cents");
            changeMap.set(e + " cents", value + 1);
        }
        else {
            changeMap.set(e + " cents", 1);
        }
    });
    changeMap.forEach((value, key) => {
        changeArr.push({ denomiation: key, quantity: value });
    });
    return changeArr;
}
exports.fromatChange = fromatChange;
function updateProductInventory(slot, quanity) {
    var item = itemCollection.find({ slotId: slot.slotId }, { _id: 0 })[0];
    item.product.quantity -= quanity;
    itemCollection.update({
        slotId: slot.slotId
    }, {
        $overwrite: {
            product: item.product
        }
    });
}
exports.updateProductInventory = updateProductInventory;
//Get coins configured in the system
function getCoins() {
    let coin = coinCollection.find({}, { _id: 0 });
    coin = [...coin];
    let coinMap = new Map();
    coin.forEach(e => {
        coinMap.set(e.denomination, e.noCoinAvailable);
    });
    return coinMap;
}
exports.getCoins = getCoins;
//get change the user is to collec per coin
function getChange(change) {
    let coinMap = getCoins();
    let toBeChange = [];
    let coin = coinCollection.find({}, { _id: 0 });
    while (change > 0) {
        //check for 50 cents
        for (var i = 0; i < coin.length; i++) {
            if (change >= coin[i].denomination && coinMap.has(coin[i].denomination)) {
                toBeChange.push(coin[i].denomination);
                change = change - coin[i].denomination;
                continue;
            }
        }
        /*  try{  if(change >= 0.50 && coinMap.has(0.50)){
               toBeChange.push(0.50);
               change = change - 0.50;
               continue;
           }
            //check for 25 cents
           else if(change >= 0.25 && coinMap.has(0.25)){
               toBeChange.push(0.25)
               change= change -0.25
               continue;
           }
            //check for 10 cents
           else if(change >= 0.10 && coinMap.has(0.10)){
               toBeChange.push(0.10)
               change=  change - 0.10;
               continue;
           }
            //check for 5 cents
           else if(change >= 0.05 && coinMap.has(0.05)){
               toBeChange.push(0.05)
               change = change- 0.05;
               continue;
           }
           else{
               throw "No sufficient change for this purchase"
           }}
           catch(e){
               return "No sufficient change for this purchase"
           } */
    }
    return toBeChange;
}
exports.getChange = getChange;
//update the coin inventory after taking change from the system
function updateCoinChange(change) {
    let coinMap = getCoins();
    change.forEach(e => {
        if (coinMap.has(e)) {
            let value = coinMap.get(e);
            coinMap.set(e, value - 1);
            coinCollection.update({
                denomination: e
            }, {
                noCoinAvailable: value - 1
            });
        }
    });
}
exports.updateCoinChange = updateCoinChange;
//check if user requires change
function requiresChange(balance) {
    if (balance > 0)
        return true;
    return false;
}
exports.requiresChange = requiresChange;
