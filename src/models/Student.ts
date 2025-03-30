import { Schema, model, Document } from "mongoose";


// Interface para dados do aluno
export interface IStudent extends Document {
    registration: string;
    name: string;
    cpf: string;
    email: string;
    tel: number;
    status: 'ativo' | 'inativo';
    linkedTo: Schema.Types.ObjectId; // Referência para um usuário no banco
}

// Criando Schema do mongoose
const studentSchema = new Schema<IStudent>(
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
export const Student = model<IStudent>('Student', studentSchema);