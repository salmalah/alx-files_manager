import { ObjectID } from 'mongodb';
import { v4 as uuid } from 'uuid';
import dbClient from '../utils/db';
import { writeFile } from '../utils/files';
import fileQueue from '../utils/image_upload';

const validFiles = ['folder', 'file', 'image'];

export const postUpload = async (request, response) => {
  try {
    const { name, type, data } = request.body;
    let { parentId, isPublic } = request.body;

    if (parentId === undefined) parentId = '0';
    if (isPublic === undefined) isPublic = false;

    if (!name) {
      response.status(400).json({ error: 'Missing name' });
      return;
    }

    if (!type || !validFiles.includes(type)) {
      response.status(400).json({ error: 'Missing type' });
      return;
    }

    if (type !== 'folder' && !data) {
      response.status(400).json({ error: 'Missing data' });
      return;
    }

    if (parentId !== '0') {
      const parent = await dbClient.findFile({ _id: ObjectID(parentId) });

      if (!parent) {
        response.status(400).json({ error: 'Parent not found' });
        return;
      }
      if (parent.type !== 'folder') {
        response.status(400).json({ error: 'Parent is not a folder' });
        return;
      }
    }

    const fileData = {
      userId: request.user.id,
      name,
      type,
      parentId,
      isPublic,
    };

    if (type !== 'folder') {
      fileData.data = data;
      fileData.path = writeFile(uuid(), type, data);
    }

    const newFile = await dbClient.uploadFile(fileData);

    if (type === 'image') {
      await fileQueue.add(newFile);
    }

    newFile.id = newFile._id;
    delete newFile._id;
    delete newFile.data;
    delete newFile.path;

    response.json(newFile);
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: 'Server error' });
  }
};
