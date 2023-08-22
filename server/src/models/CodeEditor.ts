import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
import {ICodeEditorDoc} from '../interfaces/ICodeEditor';

// 2. Create a Schema corresponding to the document interface.
const codeEditorSchema = new Schema<ICodeEditorDoc>({
    // could be empty
    code: { type: String },
    language: { type: String, required: true },
    creatorUserId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    isLive: { type: Boolean, required: true }
}, { timestamps: true });

// 3. Create a Model.
export const PublicCodeEditorModel = model<ICodeEditorDoc>("PublicCodeEditor", codeEditorSchema);

export const PrivateCodeEditorModel = model<ICodeEditorDoc>("PrivateCodeEditor", codeEditorSchema);