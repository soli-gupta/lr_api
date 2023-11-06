import { Request, Response } from "express";
import UserAddresses from "../models/user-address";
import State from "../../admin/models/state";
import City from "../../admin/models/city";

const addNewAddress = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const allAddress: any = [];
        const addressData = {
            user_id: req.user?._id,
            user_address_type: body.address_type ?? '',
            user_full_address: body.full_address ?? '',
            user_pincode: body.pincode ?? '',
            user_state: body.state ?? '',
            user_city: body.city ?? '',
        }
        const addAddress = new UserAddresses(addressData);

        await addAddress.save();

        const address = await UserAddresses.find({ user_id: req.user?._id }).where({ address_status: 1 }).sort({ createdAt: -1 })
            .limit(5);
        address.forEach((addr) => {
            allAddress.push({
                _id: addr._id,
                address_type: addr.user_address_type,
                full_address: addr.user_full_address,
                pincode: addr.user_pincode,
                state: addr.user_state,
                city: addr.user_city
            })
        });
        res.status(201).json({ status: 1, message: "Address saved successfully!", address: addAddress, allAddress });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}


const fetchAllAddress = async (req: Request, res: Response) => {
    try {
        const address: any = [];
        const allAddress = await UserAddresses.find({ user_id: req.user?._id }).where({ address_status: 1 }).sort({ createdAt: -1 })
            .limit(5);

        allAddress.forEach((addr) => {
            address.push({
                _id: addr._id,
                address_type: addr.user_address_type,
                full_address: addr.user_full_address,
                pincode: addr.user_pincode,
                state: addr.user_state,
                city: addr.user_city
            })
        });
        res.status(200).json({ status: 1, address });
    } catch (e) {
        res.status(500).json({ status: 0, message: e });
    }
}

const editAndUpdateAddress = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const allAddress: any = [];
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again.' });
        }
        const userAddress = await UserAddresses.findOne({ _id, user_id: req.user?._id })
        const state = await State.findOne({ province_title: userAddress!.user_state })
        const city = await City.find({ state_id: state!.province_id })

        const addressSchema = {
            _id: userAddress!._id,
            address_type: userAddress!.user_address_type,
            full_address: userAddress!.user_full_address,
            pincode: userAddress!.user_pincode,
            state: userAddress!.user_state,
            city: userAddress!.user_city,
            cities: city
        }
        if (req.method == 'POST') {
            userAddress!.user_state = req.body.state ? req.body.state : userAddress!.user_state
            userAddress!.user_city = req.body.city ? req.body.city : userAddress!.user_city
            userAddress!.user_full_address = req.body.full_address ? req.body.full_address : userAddress!.user_full_address
            userAddress!.user_address_type = req.body.address_type ? req.body.address_type : userAddress!.user_address_type
            userAddress!.user_pincode = req.body.pincode ? req.body.pincode : userAddress!.user_pincode
            await userAddress!.save()

            const address = await UserAddresses.find({ user_id: req.user?._id }).where({ address_status: 1 }).sort({ createdAt: -1 })
                .limit(5);
            address.forEach((addr) => {
                allAddress.push({
                    _id: addr._id,
                    address_type: addr.user_address_type,
                    full_address: addr.user_full_address,
                    pincode: addr.user_pincode,
                    state: addr.user_state,
                    city: addr.user_city
                })
            });
            res.status(200).json({ status: 1, address: addressSchema, message: 'Address updated successfully', allAddress });

        } else {
            res.status(200).json({ status: 1, address: addressSchema });
        }
    } catch (error) {
        res.status(500).json({ status: 0, message: error });
    }

}

const deleteUserAddress = async (req: Request, res: Response) => {
    try {
        const _id = req.query.id
        const allAddress: any = [];
        if (!_id) {
            return res.status(400).json({ status: 0, message: 'Something went wrong. Please refresh the page and try again!' });
        }
        const address = await UserAddresses.deleteOne({ _id, user_id: req.user?._id });
        const addresses = await UserAddresses.find({ user_id: req.user?._id }).where({ address_status: 1 }).sort({ createdAt: -1 })
            .limit(5);
        addresses.forEach((addr) => {
            allAddress.push({
                _id: addr._id,
                address_type: addr.user_address_type,
                full_address: addr.user_full_address,
                pincode: addr.user_pincode,
                state: addr.user_state,
                city: addr.user_city
            })
        });
        res.status(200).json({ status: 1, allAddress: allAddress, message: 'Your address deleted successfully!' });
    } catch (error) {
        res.status(500).json({ status: 0, message: error })
    }
}

export { addNewAddress, fetchAllAddress, editAndUpdateAddress, deleteUserAddress };