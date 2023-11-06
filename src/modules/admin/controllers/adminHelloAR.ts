

import { Request, Response } from "express"
import Products from "../../product/models/product-model";

// image_carousel
const productImageCarousel = async (req: Request, res: Response) => {
    try {

        const token: any = 'Luxury-Ride eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2ViMjFkZmY1ZmNkZDZiNWNkYTA3YTgiLCJpYXQiOjE2ODI1Nzg4MjV9.H25-UID090JAntKpBLzl9AJ_mcpFejczvXThazY5WX4';

        if (token === req.header("carousel-token")) {
            const _id: any = req.body.lookup_id;

            const getViewerData = req.body.slot_images.map((slot: any) => {
                if (slot.name === "8 Side Exterior View") {
                    return slot.images
                }
            });

            let getImages: any = [];
            let productImage: any = '';
            if (getViewerData[0] !== undefined) {

                getViewerData[0].map((img: any) => {



                    if (img.name === "Left Front Corner View") {
                        img.image_url ? getImages[7] = img.image_url.replace('uploads', '1920') : '';
                        img.image_url ? productImage = img.image_url.replace('uploads', '1920') : '';
                    }

                    if (img.name === "Left Side View") {
                        img.image_url ? getImages[6] = img.image_url.replace('uploads', '1920') : '';
                    }

                    if (img.name === "Left Rear Corner View") {
                        img.image_url ? getImages[5] = img.image_url.replace('uploads', '1920') : '';
                    }

                    if (img.name === "Back View") {
                        img.image_url ? getImages[4] = img.image_url.replace('uploads', '1920') : '';
                    }

                    if (img.name === "Right Rear Corner View") {
                        img.image_url ? getImages[3] = img.image_url.replace('uploads', '1920') : '';
                    }

                    if (img.name === "Right Side View") {
                        img.image_url ? getImages[2] = img.image_url.replace('uploads', '1920') : '';
                    }

                    if (img.name === "Right Front Corner View") {
                        img.image_url ? getImages[1] = img.image_url.replace('uploads', '1920') : '';
                    }

                    if (img.name === "Front View") {
                        img.image_url ? getImages[0] = img.image_url.replace('uploads', '1920') : '';
                    }
                    return getImages;
                });
            }

            const product = await Products.findById({ _id });

            if (!product) {
                return res.status(404).json({ status: 2, message: 'Something went wrong. Please refresh the page and try again.' })
            }


            product.image_carousel = getImages ? getImages.reverse() : product.image_carousel;
            product.product_image = productImage;


            product.save();

            res.status(200).json({ status: 1, message: ` image carousel fetched.` });
        } else {
            return res.status(500).json({ status: 2, message: 'You are not authorized.' })
        }
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}


export { productImageCarousel }