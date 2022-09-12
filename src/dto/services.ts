
import { Slot, Coin } from '../models/transaction';
import { Item } from '../models/item';
import product from "./products.json"
import coins from "./coins.json"

var ForerunnerDB = require("forerunnerdb")
var fdb = new ForerunnerDB();
export var db = fdb.db("myDatabaseName");
var itemCollection = db.collection("slotInventory", {primaryKey: "slotId"});
var coinCollection = db.collection("coins",{primaryKey: "denomination"});

coinCollection.primaryKey("denomination");
export function loadData(){
        const prod: Item[] = product;
        const configuredCoins: Coin[] = coins
        var slot : Slot[] =[];
    
        prod.forEach((element, index) => {
            var item:Slot = {slotId:index+1,product:element};
            slot.push(item);
        });
        coinCollection.insert(configuredCoins);
        itemCollection.insert(slot)

}



