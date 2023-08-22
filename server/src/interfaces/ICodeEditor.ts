import { Document } from "mongoose";

export interface ICodeEditor {
    code: string;
    language: string;
    creatorUserId: string;
    title: string;
    description: string;
    isLive: boolean;
}

export interface ICodeEditorDoc extends ICodeEditor, Document {
}
