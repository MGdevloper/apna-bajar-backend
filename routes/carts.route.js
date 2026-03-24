import { Router } from "express";

let cart=Router()

import { addtocart, clearcart, getcart, removefromcart, updatecart } from "../controllers/carts.js";

cart.post("/getcart",getcart)
cart.post("/addtocart",addtocart)
cart.post("/removefromcart",removefromcart)
cart.post("/clearcart",clearcart)
cart.post("/updatecart",updatecart)

export default cart