import fs from 'fs';
import path from 'path';
import util from 'util';
import jsonfile from 'jsonfile';

const writeFileAsync = util.promisify(fs.writeFile);
const existsAsync = util.promisify(fs.exists);
const makeDirAsync = util.promisify(fs.mkdir);
const readdirAsync = util.promisify(fs.readdir);
const deleteFileAsync = util.promisify(fs.unlink);
const readJsonFileAsync = util.promisify(jsonfile.readFile);
const writeJsonFileAsync = util.promisify(jsonfile.writeFile);

async function verifyFolder(filePath) {
  // TODO sakal should check if make dir handles deep path
  const folder = path.dirname(filePath);
  const exists = await existsAsync(folder);
  if (!exists) {
    await makeDirAsync(folder);
  }
}

export async function getFolderFiles(folderPath, suffix) {
  await verifyFolder(folderPath);
  const files = await readdirAsync(folderPath);
  if (suffix) {
    return files.filter(filePath => (path.extname(filePath) || '').toLowerCase() === suffix.toLowerCase());
  }

  return files;
}

export async function deleteFile(filePath) {
  if (await existsAsync(filePath)) {
    return deleteFileAsync(filePath);
  }

  return null;
}

export async function writeFile(filePath, data, options) {
  await verifyFolder(filePath);
  return writeFileAsync(filePath, data, options);
}

export async function readJsonFile(filePath, options) {
  const exists = await existsAsync(filePath);
  if (!exists) {
    return null;
  }
  return readJsonFileAsync(filePath, options);
}

export async function writeJsonFile(filePath, obj, options) {
  await verifyFolder(filePath);
  await writeJsonFileAsync(filePath, obj, options);
}
