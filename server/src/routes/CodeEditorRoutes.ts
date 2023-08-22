import express from 'express';
import * as CodeEditorController from '../controller/CodeEditorController';


const codeEditorRouter = express.Router();

codeEditorRouter.post('/create', CodeEditorController.createCodeEditor);

codeEditorRouter.get('/all', CodeEditorController.getAllUserCodeEditor)

codeEditorRouter.get('/:id', CodeEditorController.getCodeEditor);

codeEditorRouter.put('/:id', CodeEditorController.updateCodeInCodeEditor);

//codeEditorRouter.patch('/:id', CodeEditorController.updateCodeEditor);

codeEditorRouter.post('/changeLiveState/:id', CodeEditorController.makeCodeEditorLive);

export default codeEditorRouter;