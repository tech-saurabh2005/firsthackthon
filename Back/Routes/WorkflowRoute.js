import express from 'express';
import multer from 'multer';
import * as controller from '../Controllers/WorkflowController.js';

const router = express.Router();
const upload = multer(); // memory storage; small JSON files only

router.get('/', controller.getWorkflows);
router.post('/', controller.createWorkflow);
router.get('/:id', controller.getWorkflowById);
router.put('/:id', controller.updateWorkflow);
router.delete('/:id', controller.deleteWorkflow);
router.post('/import', upload.single('file'), controller.importWorkflow);
router.get('/:id/export', controller.exportWorkflow);
router.post('/:id/execute', controller.executeWorkflow);

export default router;