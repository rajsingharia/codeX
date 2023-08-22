import express from 'express';
import * as CodeEditorController from '../controller/CodeEditorController';


const publicCodeEditorRouter = express.Router();

publicCodeEditorRouter.get('/all', CodeEditorController.getAllPublicCodeEditor)

export default publicCodeEditorRouter;