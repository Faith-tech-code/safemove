const { authenticate } = require('../utils/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs only
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  }
});

module.exports = async function (fastify, opts) {
  // File upload endpoint
  fastify.post('/', {
    preHandler: authenticate,
    handler: async (req, reply) => {
      try {
        // Use multipart for file uploads
        const data = await req.file();
        
        if (!data) {
          return reply.code(400).send({ error: 'No file provided' });
        }

        const uploadDir = path.join(__dirname, '../uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(data.filename);
        const filename = `${req.user._id}-${uniqueSuffix}${ext}`;
        const filepath = path.join(uploadDir, filename);

        // Save file
        const buffer = await data.toBuffer();
        await fs.writeFile(filepath, buffer);

        // Return URL (in production, this would be a CDN URL)
        const url = `/uploads/${filename}`;

        return reply.send({
          url,
          mimeType: data.mimetype,
          filename: data.filename,
          size: buffer.length
        });
      } catch (error) {
        if (error.message === 'Invalid file type. Only images and PDFs are allowed.') {
          return reply.code(400).send({ error: error.message });
        }
        return reply.code(500).send({ error: 'Upload failed' });
      }
    }
  });

  // URL-based upload (download from URL and save)
  fastify.post('/url', {
    preHandler: authenticate,
    handler: async (req, reply) => {
      try {
        const { url } = req.body;

        if (!url) {
          return reply.code(400).send({ error: 'URL is required' });
        }

        // Download file from URL
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to download file');
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        const contentType = response.headers.get('content-type');

        const uploadDir = path.join(__dirname, '../uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = contentType?.includes('pdf') ? '.pdf' : '.jpg';
        const filename = `${req.user._id}-${uniqueSuffix}${ext}`;
        const filepath = path.join(uploadDir, filename);

        await fs.writeFile(filepath, buffer);

        return reply.send({
          url: `/uploads/${filename}`,
          mimeType: contentType,
          size: buffer.length
        });
      } catch (error) {
        return reply.code(500).send({ error: 'URL upload failed' });
      }
    }
  });

  // Base64 upload
  fastify.post('/base64', {
    preHandler: authenticate,
    handler: async (req, reply) => {
      try {
        const { base64, mimeType } = req.body;

        if (!base64) {
          return reply.code(400).send({ error: 'Base64 data is required' });
        }

        // Remove data URL prefix if present
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const uploadDir = path.join(__dirname, '../uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = mimeType?.includes('png') ? '.png' : '.jpg';
        const filename = `${req.user._id}-${uniqueSuffix}${ext}`;
        const filepath = path.join(uploadDir, filename);

        await fs.writeFile(filepath, buffer);

        return reply.send({
          url: `/uploads/${filename}`,
          mimeType: mimeType || 'image/jpeg',
          size: buffer.length
        });
      } catch (error) {
        return reply.code(500).send({ error: 'Base64 upload failed' });
      }
    }
  });

  // Get uploaded file
  fastify.get('/:filename', async (req, reply) => {
    try {
      const { filename } = req.params;
      const filepath = path.join(__dirname, '../uploads', filename);

      const stat = await fs.stat(filepath);
      if (!stat.isFile()) {
        return reply.code(404).send({ error: 'File not found' });
      }

      const ext = path.extname(filename).toLowerCase();
      const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.pdf': 'application/pdf'
      };

      reply.header('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      return reply.sendFile(filename, path.join(__dirname, '../uploads'));
    } catch (error) {
      return reply.code(404).send({ error: 'File not found' });
    }
  });
};
