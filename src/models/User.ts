import mongoose, {Schema, ObjectId, Document} from 'mongoose'
import { ExpenseInterface} from './Expense';


export interface UserInterface extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    expenses: ObjectId[];
}

const UserSchema: Schema<UserInterface> = new Schema ({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/,"Please use a valid email address"]  // regular expression to check email address
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },

    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required"]
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
    }]
}, {timestamps: true})

const UserModel = (mongoose.models.User as mongoose.Model<UserInterface>) || mongoose.model<UserInterface>("User", UserSchema)
export default UserModel;