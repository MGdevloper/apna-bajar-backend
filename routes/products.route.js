import { Router } from "express";

import { addproduct ,getproducts,deleteproduct,editproductname,addvariant,deletevariant,editvariant} from "../controllers/product.js";

const products = Router()

products.post("/addproduct", addproduct)
products.post("/getproducts", getproducts)

products.post("/deleteproduct", deleteproduct)
products.post("/editproductname",editproductname)
products.post("/addvariant",addvariant)
products.post("/deletevariant",deletevariant)
products.post("/editvariant",editvariant)
export default products
