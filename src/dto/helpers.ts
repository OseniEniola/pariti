import { Change, Coin, Slot } from "..//models/transaction";
import {db} from "../dto/services"



var itemCollection = db.collection("slotInventory");
var coinCollection = db.collection("coins")
var salesCollection = db.collection("sales")

export function fromatChange(change:number[]){
    let changeMap = new Map<string,number>();
    let changeArr:Change[] = []
    change.forEach(e =>{
        if(changeMap.has(e.toString()+" cents")){
            let value = changeMap.get(e.toString()+" cents") as number;
            changeMap.set(e+" cents", value + 1);
        }else{
            changeMap.set(e+" cents", 1);
        }
       });
       changeMap.forEach((value: number, key: string) => {
        changeArr.push({denomiation:key,quantity:value})
    });
    return changeArr;
}

export function updateProductInventory(slot:Slot,quanity:number){
    var item:Slot = itemCollection.find({slotId: slot.slotId},{_id:0})[0]
    item.product.quantity -=quanity
    itemCollection.update({
        slotId : slot.slotId
    },{
        $overwrite: {
            product: item.product
        }
    })
}
//Get coins configured in the system
export function getCoins(){
    let coin:Coin[] = coinCollection.find({},{_id:0})
    coin = [...coin]
    let coinMap =  new Map();
    coin.forEach(e =>{
        coinMap.set(e.denomination,e.noCoinAvailable)
    })
    return coinMap
}

//get change the user is to collec per coin
export function getChange(change:number){
    let coinMap = getCoins()
    let toBeChange: number[]=[];
    while(change >0){
        //check for 50 cents
      try{  if(change >= 0.50 && coinMap.has(0.50)){
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
        }
    }
    return toBeChange;
}

//update the coin inventory after taking change from the system
export function updateCoinChange(change:number[]){
    
    let coinMap = getCoins()
   change.forEach(e =>{
    if(coinMap.has(e)){
        let value = coinMap.get(e);
        coinMap.set(e,value-1);
        coinCollection.update({
            denomination : e
        },{
            noCoinAvailable : value-1
        })
    }
   })
}

//check if user requires change
export function requiresChange(balance:number){
    if(balance > 0)
        return true;
    return false;
}