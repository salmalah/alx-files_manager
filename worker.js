// worker.js
const Bull = require('bull');
const dbClient = require('./utils/db');
const thumbnail = require('image-thumbnail');
const fs = require('fs').promises;
const { sendWelcomeEmail } = require('./emailService'); // Import your email sending logic

const fileQueue = new Bull('fileQueue');
const userQueue = new Bull('userQueue');

fileQueue.process(async (job) => {
  const { userId, fileId } = job.data;

  if (!userId) {
    throw new Error('Missing userId');
  }

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  const user = await dbClient.db.collection('users').findOne({ _id: userId });

  if (!user) {
    throw new Error('User not found');
  }

  const file = await dbClient.db.collection('files').findOne({
    _id: fileId,
    userId: userId,
    type: 'image',
  });

  if (!file) {
    throw new Error('File not found');
  }

  const originalPath = file.localPath;

  // Generate thumbnails with different sizes
  const sizes = [500, 250, 100];
  const thumbnailPromises = sizes.map(async (size) => {
    const thumbnailPath = `${originalPath.replace(/\.[^/.]+$/, '')}_${size}.jpg`;
    const options = { width: size };

    try {
      const thumbnailBuffer = await thumbnail(originalPath, options);
      await fs.writeFile(thumbnailPath, thumbnailBuffer);
    } catch (error) {
      console.error(`Error generating thumbnail for size ${size}:`, error);
    }
  });

  await Promise.all(thumbnailPromises);
});

userQueue.process(async (job) => {
  const { userId } = job.data;

  if (!userId) {
    throw new Error('Missing userId');
  }

  const user = await dbClient.db.collection('users').findOne({ _id: userId });

  if (!user) {
    throw new Error('User not found');
  }

  // Send a welcome email to the user
  await sendWelcomeEmail(user.email);

  console.log(`Welcome ${user.email}!`);
});

module.exports = { fileQueue, userQueue };
