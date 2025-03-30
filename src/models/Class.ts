import { Schema, model, Types, Document } from 'mongoose';
import { Student } from './Student';


// Interface para dados da turma
interface IClass extends Document {
    code: string;
    course: string;
    modality: 'presencial' | 'semi-presencial' | 'ead';
    students: Types.ObjectId[];
    startDate: Date;
    endDate: Date;
    instructor: Schema.Types.ObjectId | null; // Referência para um instrutor no banco
    status: 'concluída' | 'em andamento' | 'não iniciada' | 'cancelada';
    linkedTo: Schema.Types.ObjectId; // Referência para um usuário no banco
}

// Criando Schema do mongoose
const classSchema = new Schema<IClass>(
    {
        code: {
            type: String,
            required: true,
            unique: true
        },
        course: {
            type: String,
            required: true
        },
        modality: {
            type: String,
            enum: ['presencial', 'semi-presencial', 'ead'],
            required: true
        },
        students: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
            validate: [studentsLimit, 'Uma turma pode ter no máximo 50 alunos'],
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        instructor: {
            type: Schema.Types.ObjectId,
            ref: 'Instructor',
            default: null // Padrão "À definir" (null no banco)
        },
        status: {
            type: String,
            enum: ['concluída', 'em andamento', 'não iniciada', 'cancelada'],
            default: 'não iniciada'
        },
        linkedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {timestamps: true}
);

// Função para validar limite de alunos
function studentsLimit(val: Types.ObjectId[]) {
    return val.length <= 50;
}

// Middleware para remover aluno de turmas quando ele for deletado
classSchema.pre('save', async function (next) {    
    const studentsIds = await Student.find({ _id: { $in: this.students } }).distinct('_id');
    this.students = studentsIds as Types.ObjectId[];
    next();
});

// Criando e exportando o modelo
export const Class = model<IClass>('Class', classSchema);