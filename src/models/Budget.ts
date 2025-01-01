import mongoose, {Schema, ObjectId, Document} from 'mongoose'

export interface BudgetInterface extends Document {
    createdBy: ObjectId;
    title: string;
    category: 'Food' | 'Transport' | 'Shopping' | 'Utilities' | 'HealthCare' | 'Others';
    amount: number;
    description: string;
    icon: string;
    createdAt: Date;
    updatedAt?: Date;
}

const BudgetSchema: Schema<BudgetInterface> = new Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    
    category: {
        type: String,
        required: true,
        enum: ['Food','Transport', 'Shopping', 'Utilities', 'Healthcare', 'Others']
    },
    
    amount: {
        type: Number,
        required: true
    },
    
    description: {
        type: String,
        trim: true
    },
    
    icon: {
        type: String,
        trim: true
    },
    
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    
    updatedAt: {
        type: Date,
        default: Date.now()
    }
}, {timestamps: true})

const BudgetModel = (mongoose.models.Budget as mongoose.Model<BudgetInterface>) || mongoose.model<BudgetInterface>("Budget", BudgetSchema)
export default BudgetModel;