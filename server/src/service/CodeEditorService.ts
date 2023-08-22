import createHttpError from "http-errors";
import { ICodeEditor, ICodeEditorDoc } from "../interfaces/ICodeEditor";
import { PrivateCodeEditorModel, PublicCodeEditorModel } from "../models/CodeEditor";


export const createCodeEditor = async (codeEditor: ICodeEditor, isPrivate: boolean) => {
    try {
        const newCodeEditor = (isPrivate) ? new PrivateCodeEditorModel(codeEditor) : new PublicCodeEditorModel(codeEditor);
        const savedCodeEditor = await newCodeEditor.save();
        return savedCodeEditor?.id ?? null;
    }
    catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "";
        throw createHttpError(500, "Internal Server Error " + errorMessage);
    }
}


export const getCodeEditor = async (id: string, currentUserId: string) => {
    try {
        const isCodeEditorExist = await PrivateCodeEditorModel.exists({ _id: id });
        if (!isCodeEditorExist) throw createHttpError(404, "CodeEditor not found");
        const isCodeEditorCreator = await PrivateCodeEditorModel.exists({ _id: id, creatorUserId: currentUserId });
        if (!isCodeEditorCreator) throw createHttpError(403, "Unauthorized to update this codeEditor");
        return await PrivateCodeEditorModel.findById(id);
    }
    catch (error) {
        throw createHttpError(500, "Internal Server Error");
    }
}

export const updateCodeInCodeEditor = async (id: string, code: string, currentUserId: string) => {
    try {
        const isCodeEditorExist = await PrivateCodeEditorModel.exists({ _id: id });
        if (!isCodeEditorExist) throw createHttpError(404, "CodeEditor not found");
        const isCodeEditorCreator = await PrivateCodeEditorModel.exists({ _id: id, creatorUserId: currentUserId });
        if (!isCodeEditorCreator) throw createHttpError(403, "Unauthorized to update this codeEditor");
        await PrivateCodeEditorModel.findOneAndUpdate({ _id: id }, { code: code });
    }
    catch (error) {
        throw createHttpError(500, "Internal Server Error");
    }
}

export const updateIsLiveInCodeEditor = async (id: string, isLive: boolean, currentUserId: string) => {
    try {
        const isCodeEditorExist = await PrivateCodeEditorModel.exists({ _id: id });
        if (!isCodeEditorExist) throw createHttpError(404, "CodeEditor not found");
        const isCodeEditorCreator = await PrivateCodeEditorModel.exists({ _id: id, creatorUserId: currentUserId });
        if (!isCodeEditorCreator) throw createHttpError(403, "Unauthorized to update this codeEditor");
        await PrivateCodeEditorModel.findOneAndUpdate({ _id: id }, { isLive: isLive });
    }
    catch (error) {
        throw createHttpError(500, "Internal Server Error");
    }
}

export const updateCodeEditor = async (id: string, codeEditor: ICodeEditor) => {
    try {
        const codeEditorInDb = await PrivateCodeEditorModel.findById(id);
        if (!codeEditorInDb) throw createHttpError(404, "CodeEditor Not Found");
        await codeEditorInDb.updateOne(codeEditor);
        return codeEditorInDb;
    } catch (error) {
        throw createHttpError(500, "Internal Server Error");
    }
}

interface getAllCodeEditorResponse {
    page: ICodeEditorDoc[],
    totalPages: number,
}

export const getAllUserCodeEditor = async (userId: string, page: number, limit: number): Promise<getAllCodeEditorResponse> => {
    try {
        const totalCodeEditor = await PrivateCodeEditorModel.countDocuments({ creatorUserId: userId });
        const totalPages = Math.ceil(totalCodeEditor / limit);

        const userPrivateCodeEditorList: ICodeEditorDoc[] | undefined =
            await PrivateCodeEditorModel.
                find({ creatorUserId: userId })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });

        if (!userPrivateCodeEditorList) throw createHttpError(400, "CodeEditor Not Found");

        return { page: userPrivateCodeEditorList, totalPages: totalPages };
    } catch (error) {
        throw createHttpError(500, "Internal Server Error");
    }
}



export const getAllPublicCodeEditor = async (page: number, limit: number): Promise<getAllCodeEditorResponse> => {
    try {

        const totalCodeEditor = await PublicCodeEditorModel.countDocuments({});
        const totalPages = Math.ceil(totalCodeEditor / limit);
        
        const publicCodeEditorList: ICodeEditorDoc[] | undefined =
            await PublicCodeEditorModel
                .find({})
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });

        if (!publicCodeEditorList) throw createHttpError(400, "CodeEditor Not Found");
        return { page: publicCodeEditorList, totalPages: totalPages };
    } catch (error) {
        throw createHttpError(500, "Internal Server Error");
    }
}