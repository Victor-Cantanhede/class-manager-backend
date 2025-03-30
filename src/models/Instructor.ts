import { Schema, model, Document } from "mongoose";


// Interface para dados do instrutor
interface IInstructor extends Document {
    registration: string;
    name: string;
    cpf: string;
    email: string;
    tel: number;
    specialization: string[];
    status: 'ativo' | 'inativo';
    linkedTo: Schema.Types.ObjectId; // Referência para um usuário no banco
}

// Criando Schema do mongoose
const instructorSchema = new Schema<IInstructor>(
    {
        registration: {
            type: String,
            unique: true,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        cpf: {
            type: String,
            unique: true,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        tel: {
            type: Number,
            unique: true,
            required: true
        },
        specialization: {
            type: [String],
            required: true
        },
        status: {
            type: String,
            enum: ['ativo', 'inativo'],
            default: 'ativo'
        },
        linkedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {timestamps: true}
);

// Criando e exportando o modelo
export const Instructor = model<IInstructor>('Instructor', instructorSchema);