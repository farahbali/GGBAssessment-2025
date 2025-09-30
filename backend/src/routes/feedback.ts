import express from 'express';
import { FeedbackController } from '../controllers/feedbackController';
import { requestLogger } from '../middleware/logger';



const router = express.Router();

router.use(requestLogger);




router.get(
  '/',
  FeedbackController.getAllFeedbacks
);

router.get('/stats', FeedbackController.getFeedbackStats);

router.post(
  '/',
  FeedbackController.createFeedback
);

router.use('/:id');

router.get('/:id', FeedbackController.getFeedbackById);

router.patch(
  '/:id',
  FeedbackController.updateFeedbackStatus
);

router.delete(
  '/:id',
  FeedbackController.deleteFeedback
);

router.post(
  '/bulk-update',
  FeedbackController.bulkUpdateStatus
);

export default router;