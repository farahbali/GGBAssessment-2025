import express from 'express';
import { FeedbackController } from '../controllers/feedbackController';
import { requestLogger } from '../middleware/logger';
import {
    generalRateLimit,
    requestSizeLimiter,
    sanitizeRequest,
    securityAudit,
    strictRateLimit,
} from '../middleware/security';
import {
    validateCreateFeedback,
    validateFeedbackId,
    validateFeedbackQuery,
    validateUpdateStatus,
} from '../validators/feedback';

const router = express.Router();

router.use(requestLogger);
router.use(sanitizeRequest);
router.use(securityAudit);
router.use(requestSizeLimiter(1024 * 1024));



router.use(generalRateLimit);

router.get(
  '/',
  validateFeedbackQuery,
  FeedbackController.getAllFeedbacks
);

router.get('/stats', FeedbackController.getFeedbackStats);

router.post(
  '/',
  validateCreateFeedback,
  FeedbackController.createFeedback
);

router.use('/:id', validateFeedbackId);

router.get('/:id', FeedbackController.getFeedbackById);

router.patch(
  '/:id',
  strictRateLimit,
  validateUpdateStatus,
  FeedbackController.updateFeedbackStatus
);

router.delete(
  '/:id',
  strictRateLimit,
  FeedbackController.deleteFeedback
);

router.post(
  '/bulk-update',
  strictRateLimit,
  FeedbackController.bulkUpdateStatus
);

export default router;