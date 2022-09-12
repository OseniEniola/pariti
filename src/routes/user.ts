import express from 'express';
import { Purchase, Slot,Coin, PurchaseRes, Change } from '../models/transaction';
import {db} from "../dto/services"
import * as helper from "../dto/helpers"

const router = express.Router();
var itemCollection = db.collection("slotInventory");
var salesCollection = db.collection("sales")

//Get products available on the vending machine
router.get("/products",async (req, res) => {
  
    const data:Slot[] = itemCollection.find({},{_id:0});
   // console.log("data",data)
    if(data){
        return  res.status(200).json(data)
    }else{
        return res.status(404).json('No products available')
    }
})

//purchase product in a vending slot
router.post("/purchase/:slotId",async (req, res) => {
   var slotId = req.params.slotId;
   var body: Purchase = req.body;
   var item:Slot = itemCollection.find({slotId: slotId},{_id:0})[0]

   if(body.quanity < 1){
    return res.status(400).json({"message": "Minimum of 1 products is required"});
   }
   //check if the slot is valid, if not return message
    if(!item?.slotId){
       return res.status(400).json({"message": "Invalid slot selected"});
    }
    var customerChange = body.amountPaid - (item.product.price * body.quanity)

    //check if product is in stock 
   if(item.product.quantity < body.quanity){
   return res.status(200).json({"message": item.product.quantity > 0 ? `Only ${item.product.quantity} left`: "Product is out of stck"});
   }

   //Validate that the amount of money the user paid is enough to buy producr
   if((item.product.price * body.quanity) > body.amountPaid){
   return  res.status(200).json([{"message": "Insufficient amount to purchase this product",
                        "totalprice":"$"+(item.product.price * body.quanity),
                        "amountPaid":body.amountPaid}]);
   }
   //check if customr need change then process transaction
   if(helper.requiresChange(customerChange)){

  let calculatedChange: number[] | string = helper.getChange(customerChange);
        if( typeof calculatedChange == "string"){
            return res.status(200).json({"message":calculatedChange})
        }else{
            helper.updateCoinChange(calculatedChange); 
            helper.updateProductInventory(item,body.quanity)
            let response:PurchaseRes ={} as PurchaseRes
            response.product= item.product.itemName
            response.productPrice = item.product.price
            response.quanity = body.quanity;
            response.amountPaid = body.amountPaid;
            response.change= helper.fromatChange(calculatedChange);
            salesCollection.insert(response);
            return res.status(200).json({"data":response})
        }   
   }else{
    helper.updateProductInventory(item,body.quanity)
    let response:PurchaseRes ={} as PurchaseRes
    response.product= item.product.itemName
    response.productPrice = item.product.price
    response.quanity = body.quanity;
    response.amountPaid = body.amountPaid;
    response.change=[];
    salesCollection.insert(response);
    return res.status(200).json({"data":response})
   }
})

export default router;
