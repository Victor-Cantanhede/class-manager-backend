import mongoose, { Schema } from 'mongoose';


// Interface do Token
interface IToken {
    email: string;
    code: string;
    createdAt: Date;
}

// Schema
const TokenSchema = new Schema<IToken>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Expira em 5 minutos
    }
});

export const TokenVerification = mongoose.model<IToken>(
    'TokenVerification', TokenSchema
);