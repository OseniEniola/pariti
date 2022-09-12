import { Item } from "./item";

export interface Coin{
    denomination: number;
    noCoinAvailable: number
}

export interface Purchase{
    quanity:number;
    amountPaid: number;
}

export interface PurchaseRes{
    product:string;
    quanity:number;
    amountPaid: number;
    productPrice: number
    change:Change[];
}

export interface Slot{
    slotId: number;
    product: Item;
}

export interface Change{
    denomiation:string;
    quantity: number;
}

