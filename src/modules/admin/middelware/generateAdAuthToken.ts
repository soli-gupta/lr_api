import jwt, { Secret } from 'jsonwebtoken';
import Admin, { IAdmin } from '../models/admin';
import { JWT_SECRET } from '../../../config';
import { DocumentDefinition } from 'mongoose';

const generateAdAuthToken = async (_id: DocumentDefinition<IAdmin>) => {
    const jwtSecretKey: Secret = JWT_SECRET!;
    const admin = await Admin.findById({ _id });
    const token = jwt.sign({ _id: admin?._id.toString() }, jwtSecretKey);
    admin!.tokens = admin!.tokens.concat({ token });
    await admin!.save();
    return token;
}

export default generateAdAuthToken;