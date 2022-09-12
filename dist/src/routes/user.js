"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const services_1 = require("../dto/services");
const helper = __importStar(require("../dto/helpers"));
const router = express_1.default.Router();
var itemCollection = services_1.db.collection("slotInventory");
var salesCollection = services_1.db.collection("sales");
//Get products available on the vending machine
router.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = itemCollection.find({}, { _id: 0 });
    // console.log("data",data)
    if (data) {
        return res.status(200).json(data);
    }
    else {
        return res.status(404).json('No products available');
    }
}));
//purchase product in a vending slot
router.post("/purchase/:slotId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var slotId = req.params.slotId;
    var body = req.body;
    var item = itemCollection.find({ slotId: slotId }, { _id: 0 })[0];
    if (body.quanity < 1) {
        return res.status(400).json({ "message": "Minimum of 1 products is required" });
    }
    //check if the slot is valid, if not return message
    if (!(item === null || item === void 0 ? void 0 : item.slotId)) {
        return res.status(400).json({ "message": "Invalid slot selected" });
    }
    var customerChange = body.amountPaid - (item.product.price * body.quanity);
    //check if product is in stock 
    if (item.product.quantity < body.quanity) {
        return res.status(200).json({ "message": item.product.quantity > 0 ? `Only ${item.product.quantity} left` : "Product is out of stck" });
    }
    //Validate that the amount of money the user paid is enough to buy producr
    if ((item.product.price * body.quanity) > body.amountPaid) {
        return res.status(200).json([{ "message": "Insufficient amount to purchase this product",
                "totalprice": "$" + (item.product.price * body.quanity),
                "amountPaid": body.amountPaid }]);
    }
    //check if customr need change then process transaction
    if (helper.requiresChange(customerChange)) {
        let calculatedChange = helper.getChange(customerChange);
        if (typeof calculatedChange == "string") {
            return res.status(200).json({ "message": calculatedChange });
        }
        else {
            helper.updateCoinChange(calculatedChange);
            helper.updateProductInventory(item, body.quanity);
            let response = {};
            response.product = item.product.itemName;
            response.productPrice = item.product.price;
            response.quanity = body.quanity;
            response.amountPaid = body.amountPaid;
            response.change = helper.fromatChange(calculatedChange);
            salesCollection.insert(response);
            return res.status(200).json({ "data": response });
        }
    }
    else {
        helper.updateProductInventory(item, body.quanity);
        let response = {};
        response.product = item.product.itemName;
        response.productPrice = item.product.price;
        response.quanity = body.quanity;
        response.amountPaid = body.amountPaid;
        response.change = [];
        salesCollection.insert(response);
        return res.status(200).json({ "data": response });
    }
}));
exports.default = router;
