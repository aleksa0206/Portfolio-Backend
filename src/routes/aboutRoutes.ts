import { Router } from 'express';
import { getAbout, saveAbout } from '../controllers/aboutController';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { saveAboutSchema } from '../validations/aboutValidation';

const router = Router();

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Get about section data
 *     tags: [About]
 *     responses:
 *       200:
 *         description: About section data
 */
router.get('/', getAbout);

/**
 * @swagger
 * /about:
 *   put:
 *     summary: Create or update the about section
 *     tags: [About]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, title, bio]
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Aleksa
 *               title:
 *                 type: string
 *                 example: Software Developer
 *               bio:
 *                 type: string
 *               texts:
 *                 type: object
 *                 description: Overrides for small site texts, keyed by text id
 *                 additionalProperties:
 *                   type: string
 *               tagline:
 *                 type: string
 *               faviconUrl:
 *                 type: string
 *               photoUrl:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: About section saved
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/', requireAuth, validateBody(saveAboutSchema), saveAbout);

export default router;