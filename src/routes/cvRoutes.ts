import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/db';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

// The CV behind the "important" easter egg: one PDF, stored in the DB (table Cv, id 1).
// Small enough not to need a service/repository layer.
const router = Router();

const MAX_BYTES = 5 * 1024 * 1024;

const uploadCvSchema = z.object({
  filename: z.string().trim().min(1).max(150),
  // base64 of the PDF bytes, checked again after decoding
  data: z.string().min(1).max(Math.ceil((MAX_BYTES * 4) / 3) + 4),
});

/**
 * @swagger
 * /cv:
 *   get:
 *     summary: Download the CV (PDF)
 *     tags: [CV]
 *     responses:
 *       200:
 *         description: The PDF file
 *       404:
 *         description: No CV uploaded
 */
router.get('/', async (req, res) => {
  const cv = await prisma.cv.findUnique({ where: { id: 1 } });
  if (!cv) return res.status(404).json({ error: 'NOT_FOUND' });
  res
    .type('application/pdf')
    .attachment(cv.filename)
    .set('Cache-Control', 'no-cache')
    .send(Buffer.from(cv.data));
});

/**
 * @swagger
 * /cv/info:
 *   get:
 *     summary: Whether a CV is uploaded, its file name and when
 *     tags: [CV]
 */
router.get('/info', async (req, res) => {
  const cv = await prisma.cv.findUnique({
    where: { id: 1 },
    select: { filename: true, updatedAt: true },
  });
  if (!cv) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json(cv);
});

/**
 * @swagger
 * /cv:
 *   put:
 *     summary: Upload or replace the CV (PDF, base64 in JSON)
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 */
router.put('/', requireAuth, validateBody(uploadCvSchema), async (req, res) => {
  const { filename, data } = req.body as z.infer<typeof uploadCvSchema>;
  const bytes = Buffer.from(data, 'base64');
  // only real PDFs: the file must start with the %PDF magic bytes
  if (bytes.length > MAX_BYTES || bytes.subarray(0, 4).toString() !== '%PDF') {
    return res.status(400).json({ error: 'INVALID_PDF' });
  }
  const name = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
  const cv = await prisma.cv.upsert({
    where: { id: 1 },
    create: { id: 1, filename: name, data: bytes },
    update: { filename: name, data: bytes },
    select: { filename: true, updatedAt: true },
  });
  res.json(cv);
});

/**
 * @swagger
 * /cv:
 *   delete:
 *     summary: Remove the CV
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/', requireAuth, async (req, res) => {
  await prisma.cv.deleteMany({ where: { id: 1 } });
  res.status(204).end();
});

export default router;
