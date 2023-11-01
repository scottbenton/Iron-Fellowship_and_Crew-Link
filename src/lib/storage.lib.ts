import { storage } from "config/firebase.config";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_FILE_SIZE_LABEL = "5 MB";

export function uploadImage(path: string, image: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const imageRef = ref(storage, `${path}/${image.name}`);

    uploadBytes(imageRef, image)
      .then((doc) => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject(`Failed to upload ${image.name}.`);
      });
  });
}

export function deleteImage(path: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const imageRef = ref(storage, `${path}/${filename}`);

    deleteObject(imageRef)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        console.error(e);
        reject(`Failed to delete ${filename}.`);
      });
  });
}

export function getImageUrl(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const imageRef = ref(storage, path);

    getDownloadURL(imageRef)
      .then((url) => resolve(url))
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
}
