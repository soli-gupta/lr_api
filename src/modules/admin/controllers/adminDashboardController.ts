import { Request, Response } from "express";
import Products from "../../product/models/product-model";
import Brands from "../../brand/model/brand";




const countAllData = async (req: Request, res: Response) => {
    try {
        const countProduct = await Products.find({});

        const countBrands = await Brands.find({});



        res.status(200).json({ allProductCount: countProduct.length, countAllBrands: countBrands.length })
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' });
    }
}


export { countAllData };