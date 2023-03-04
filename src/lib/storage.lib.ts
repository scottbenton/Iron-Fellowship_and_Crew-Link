import { storage } from "config/firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
