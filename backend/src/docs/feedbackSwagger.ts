/**
 * @file feedbackSwagger.ts
 * Swagger documentation for FeedbackController APIs
 */

export const feedbackSwaggerDocs = `
/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: API for managing feedbacks
 */

/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get all feedbacks
 *     tags: [Feedback]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         description: Filter feedbacks by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of feedbacks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feedback'
 *                 pagination:
 *                   type: object
 */

/**
 * @swagger
 * /api/feedback/{id}:
 *   get:
 *     summary: Get a feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 */

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Create new feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFeedbackRequest'
 *     responses:
 *       201:
 *         description: Feedback created successfully
 */

/**
 * @swagger
 * /api/feedback/{id}:
 *   patch:
 *     summary: Update feedback status
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFeedbackStatusRequest'
 *     responses:
 *       200:
 *         description: Feedback status updated
 */

/**
 * @swagger
 * /api/feedback/{id}:
 *   delete:
 *     summary: Delete a feedback
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 */

/**
 * @swagger
 * /api/feedback/stats:
 *   get:
 *     summary: Get feedback statistics
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: Feedback statistics
 */

/**
 * @swagger
 * /api/feedback/bulk-status:
 *   patch:
 *     summary: Bulk update feedback status
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [pending, in_progress, completed]
 *     responses:
 *       200:
 *         description: Bulk update completed
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateFeedbackRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *     UpdateFeedbackStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed]
 */
`;
