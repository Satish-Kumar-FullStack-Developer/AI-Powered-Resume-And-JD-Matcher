import express from 'express';
import { addJobDescription, listJobDescriptions, insertSampleJobs, getJobById } from '../controllers/jobController';

const router = express.Router();

router.post('/add', addJobDescription);
router.get('/list', listJobDescriptions);
router.get('/:id', getJobById);

// Route to insert sample jobs
router.post('/insert-sample', insertSampleJobs);

export default router;
