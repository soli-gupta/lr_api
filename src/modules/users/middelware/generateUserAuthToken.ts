import jwt, { Secret } from 'jsonwebtoken';
import User, {IUSer} from '../models/user';
import { JWT_SECRET } from '../../../config';
import { DocumentDefinition } from 'mongoose';

const generateUserAuthToken = async (_id: DocumentDefinition<IUSer>) => {
    const jwtSecretKey: Secret = JWT_SECRET!;
    const user = await User.findById({ _id });
    const token = jwt.sign({ _id: user?._id.toString() }, jwtSecretKey);
    user!.tokens = user!.tokens.concat({ token });
    await user!.save();
    return token;
}

export default generateUserAuthToken;