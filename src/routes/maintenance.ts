import express from 'express';
import { Item } from '../models/item';
import {db} from "../dto/services"
import { Purchase, Slot,Coin, PurchaseRes } from '../models/transaction';
const router = express.Router();

var coinCollection = db.collection("coins")
var itemCollection = db.collection("slotInventory");
var salesCollection = db.collection("sales")

//Get coins available on the vending machine
router.get("/coins",async (req, res) => {
    const data:Slot[] = coinCollection.find({},{_id:0});
   // console.log("data",data)
    if(data){
        res.status(200).json([...data])
    }else{
        res.status(404).json('No coin available')
    }
})

//Get coins available on the vending machine
router.post("/addproduct",async (req, res) => {
    var product : Item= req.body;
    var products:Slot[] = [...itemCollection.find({})]
    if(product.price < 1){
        return res.status(400).json('Price cannot be less than $1')
    }
    if(product.quantity < 1){
        return res.status(400).json('Minimum of 1 product should be added')
    }

    products.forEach(e=>{
        if(e.product.itemName.toLowerCase() == product.itemName.toLowerCase()){
          return  res.status(201).json({"message":"Product already exists"})
        }
    })
   // console.log("data",data)
    if(product){
        let data: Slot = {} as Slot
        data.product = product
        itemCollection.insert(data)
     return   res.status(200).json({"message":"Product added successfully"})
    }else{
        return res.status(400).json('Body cannot be empty')
    }
})

//View total sales and collect money
router.get("/totalsales",async (req, res) => {
  
    const data:PurchaseRes[] = [...salesCollection.find({},{_id:0})];
    var totalSales =0 ;
    data.map(e=>{
        totalSales += e.amountPaid;
    })
   // console.log("data",data)
    if(data){
        return  res.status(200).json({"data":[...data],"totalsales":totalSales})
    }else{
        return   res.status(404).json('No coin available')
    }
})

//change the number of a coins
router.put("/setcoin",async (req,res) => {
    var {number} = req.body;
    var {denomination}= req.body;
    console.log(denomination)
    var coin:Coin = coinCollection.find({denomination: parseFloat(denomination)},{_id:0})[0]
    console.log("coin",coin)
    if(coin){
        coin.noCoinAvailable= number
        console.log(coin)
        coinCollection.update(parseFloat(denomination),{noCoinAvailable: coin.noCoinAvailable})
        return res.status(200).json([...coinCollection.find({denomination: parseFloat(denomination)},{_id:0})])
    }else{
        return  res.status(404).json('No coin available')
    }
   
})

//change the price of a product
router.put("/setprice/:slotId",async (req,res) => {
    var slotId = req.params.slotId;
    var {price} = req.body;
    if(price <1){
       return res.status(400).json({"message":"please input price"})
    }
    var item:Slot = itemCollection.find({slotId: parseInt(slotId)},{_id:0})[0]
    item.product.price =price
    itemCollection.update({
        slotId : parseInt(slotId)
    },{
        $overwrite: {
            product: item.product
        }
    })
    return  res.status(200).json(itemCollection.find({slotId: parseInt(slotId)},{_id:0})[0])
})


//change the quantity of a product
router.put("/setquantity/:slotId",async (req,res) => {
    var slotId = req.params.slotId;
    var {quantity} = req.body;
    if(quantity < 1){
        return res.status(400).json({"message":"please input quantity"})
     }
    var item:Slot = itemCollection.find({slotId: parseInt(slotId)},{_id:0})[0]
    item.product.quantity =quantity
    itemCollection.update({
        slotId : parseInt(slotId)
    },{
        $overwrite: {
            product: item.product
        }
    })
    return res.status(200).json(itemCollection.find({slotId: parseInt(slotId)},{_id:0})[0])
})

export default router;