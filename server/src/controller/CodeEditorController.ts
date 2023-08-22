import { RequestHandler } from "express";
import createHttpError from "http-errors";
import * as CodeEditorService from "../service/CodeEditorService";
import { ICodeEditor, ICodeEditorDoc } from "../interfaces/ICodeEditor";


interface GetCodeEditorBody {
    userId?: string
}


interface CreateTextEditorBody {
    userId?: string,
    language?: string,
    title?: string,
    description?: string,
    isPrivate?: boolean,
}


interface UpdateCodeInCodeEditorBody {
    userId?: string,
    code?: string,
}

interface UpdateIsLiveInCodeEditorBody {
    userId?: string,
    isLive?: boolean,
}

interface CodeEditorParams {
    id?: string,
}

interface getAllCodeEditorQueryParams {
    page?: number,
    limit?: number,
}

//any -> unsafe, unknown -> restrictive
export const createCodeEditor: RequestHandler<unknown, unknown, CreateTextEditorBody, unknown> = async (req, res, next) => {
    const language = req.body.language;
    const title = req.body.title;
    const description = req.body.description;
    const isPrivate = req.body.isPrivate ?? false;
    const userId = req.body.userId;
    try {
        if(!language || !title || !description || !userId) throw createHttpError(400, "Invalid request body");
        const codeEditor: ICodeEditor = {
            code: "",
            language: language,
            creatorUserId: userId,
            title: title,
            description: description,
            isLive: false,
        }
        const codeEditorId: ICodeEditorDoc = await CodeEditorService.createCodeEditor(codeEditor, isPrivate);
        res.status(201).json({codeEditorId: codeEditorId});
    } catch (error) {
        next(error)
    }
}


export const getCodeEditor: RequestHandler<CodeEditorParams, unknown, GetCodeEditorBody, unknown> = async (req, res, next) => {
    const id = req.params.id;
    const currentUserId = req.body.userId;
    try {
        if(!id) throw createHttpError(400, "Invalid request body");
        if(!currentUserId) throw createHttpError(400, "Invalid request body");
        const codeEditor = await CodeEditorService.getCodeEditor(id, currentUserId);
        res.status(200).json(codeEditor);
    } catch (error) {
        next(error);
    }
}


export const updateCodeInCodeEditor: RequestHandler<CodeEditorParams, unknown, UpdateCodeInCodeEditorBody, unknown> = async (req, res, next) => {
    const id = req.params.id;
    const code = req.body.code;
    const currentUserId = req.body.userId;
    try {
        if(!id || !code || !currentUserId) throw createHttpError(400, "Invalid request body");
        const codeEditor = await CodeEditorService.updateCodeInCodeEditor(id, code, currentUserId);
        res.status(200).json(codeEditor);
    } catch (error) {
        next(error);
    }
}


export const makeCodeEditorLive: RequestHandler<CodeEditorParams, unknown, UpdateIsLiveInCodeEditorBody, unknown> = async (req, res, next) => {
    const id = req.params.id;
    const isLive = req.body.isLive;
    const currentUserId = req.body.userId;
    try {
        console.log(id, isLive, currentUserId);
        if(!id || isLive == (undefined || null) || !currentUserId) throw createHttpError(400, "Invalid request body");
        const codeEditor = await CodeEditorService.updateIsLiveInCodeEditor(id, isLive, currentUserId);
        res.status(200).json(codeEditor);
    } catch (error) {
        next(error);
    }
}


export const getAllUserCodeEditor: RequestHandler<unknown, unknown, GetCodeEditorBody, getAllCodeEditorQueryParams> = async (req, res, next) => {
    const userId = req.body.userId;
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 10;
    try{
        if(!userId) throw createHttpError(400, "Invalid request body");
        const codeEditorList = await CodeEditorService.getAllUserCodeEditor(userId, page, limit);
        res.status(200).json(codeEditorList);
    } catch(error) {
        next(error);
    }
}

export const getAllPublicCodeEditor: RequestHandler<unknown, unknown, unknown, getAllCodeEditorQueryParams> = async (req, res, next) => {
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 10;
    try {
        const codeEditorList = await CodeEditorService.getAllPublicCodeEditor(page, limit);
        res.status(200).json(codeEditorList);
    } catch (error) {
        next(error);
    }
}

