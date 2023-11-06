// import { Request, Response } from "express"
// import Products from "../../product/models/product-model";

// // image_carousel
// const productImageCarousel = async (req: Request, res: Response) => {
//     try {
//         console.log(req.body);
//         const token: any = 'Luxury-Ride eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2ViMjFkZmY1ZmNkZDZiNWNkYTA3YTgiLCJpYXQiOjE2ODI1Nzg4MjV9.H25-UID090JAntKpBLzl9AJ_mcpFejczvXThazY5WX4';

//         if (token === req.header("carousel-token")) {
//             // const _id: any = req.body.id;
//             // const body: any = req.body;

//             // if (!_id) {
//             //     return res.status(400).json({ status: 2, message: 'This action is not allowed at this time. Please refresh the page and click again.' });
//             // }
//             console.log(req.body);

//             // const product = await Products.findById({ _id });

//             // if (!product) {
//             //     return res.status(404).json({ status: 2, message: 'Something went wrong. Please refresh the page and try again.' })
//             // }

//             // product.image_carousel = body.image_carousel ? body.image_carousel : product.image_carousel;
//             // product.save();${product.product_name}
//             res.status(200).json({ status: 1, message: ` image carousel fetched.` });
//         } else {
//             return res.status(500).json({ status: 2, message: 'You are not authorized.' })
//         }


//     } catch (e) {
//         res.status(500).json({ status: 0, message: 'Something went wrong.' })
//     }
// }


// export { productImageCarousel }


import { Request, Response } from "express"
import Products from "../../product/models/product-model";

// image_carousel
const productImageCarousel = async (req: Request, res: Response) => {
    try {

        const token: any = 'Luxury-Ride eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2ViMjFkZmY1ZmNkZDZiNWNkYTA3YTgiLCJpYXQiOjE2ODI1Nzg4MjV9.H25-UID090JAntKpBLzl9AJ_mcpFejczvXThazY5WX4';

        // if (token === req.header("carousel-token")) {
        // console.log(token === req.header("carousel-token"));
        // const _id: any = req.body.id;
        // const body: any = req.body;

        // if (!_id) {
        //     return res.status(400).json({ status: 2, message: 'This action is not allowed at this time. Please refresh the page and click again.' });
        // }
        // console.log(req.body);

        // if (res && res.data && res.data._items !== undefined && res.data._items !== '') {

        // console.log(req.body);

        console.log(req.body);

        console.log(req.body._items[0].lookup_id);

        const _id: any = req.body._items[0].lookup_id;

        console.log('_id : ', _id);

        const getViewerData = req.body._items[0].slot_images.map((slot: any) => {
            if (slot.name === "8 Side Exterior View") {
                return slot.images
            }

        });

        console.log(getViewerData[0]);

        let getImages: any = [];
        if (getViewerData[0] !== undefined) {

            getViewerData[0].map((img: any) => {
                console.log(img)
                if (img.name === "Front View") {
                    getImages[0] = img.image_url;
                }

                if (img.name === "Right Front Corner View") {
                    getImages[1] = img.image_url;
                }

                if (img.name === "Right Side View") {
                    getImages[2] = img.image_url;
                }

                if (img.name === "Right Rear Corner View") {
                    getImages[3] = img.image_url;
                }

                if (img.name === "Back View") {
                    getImages[4] = img.image_url;
                }

                if (img.name === "Left Rear Corner View") {
                    getImages[5] = img.image_url;
                }

                if (img.name === "Left Side View") {
                    getImages[6] = img.image_url;
                }

                if (img.name === "Left Front Corner View") {
                    getImages[7] = img.image_url;
                }
                return getImages;
            });
            console.log(getImages);
        }

        const product = await Products.findById({ _id });

        if (!product) {
            return res.status(404).json({ status: 2, message: 'Something went wrong. Please refresh the page and try again.' })
        }

        console.log('Product Details: ', product);

        product.image_carousel = getImages ? getImages : product.image_carousel;
        product.save();
        console.log('product.image_carousel : ', product.image_carousel);
        res.status(200).json({ status: 1, message: ` image carousel fetched.` });
        // } else {
        //     return res.status(500).json({ status: 2, message: 'You are not authorized.' })
        // }
    } catch (e) {
        res.status(500).json({ status: 0, message: 'Something went wrong.' })
    }
}


export { productImageCarousel }