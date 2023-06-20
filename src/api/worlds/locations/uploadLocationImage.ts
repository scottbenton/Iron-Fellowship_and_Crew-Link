import { ApiFunction, useApiState } from "hooks/useApiState";
import { constructLocationImagesPath, getLocationDoc } from "./_getRef";
import { uploadImage } from "lib/storage.lib";
import { updateDoc } from "firebase/firestore";

export const uploadLocationImage: ApiFunction<{worldId: string, locationId: string, image: File}, boolean> = (params) => {
    const {worldId, locationId, image} = params;

    return new Promise((resolve, reject) => {
        const filename = image.name;

        uploadImage(constructLocationImagesPath(worldId, locationId), image).then(() => {
            updateDoc(getLocationDoc(worldId, locationId), {
                imageFilenames: [filename]
            }).then(() => {
                resolve(true)
            }).catch(e => {
                console.error(e);
                reject("Failed to update image");
            });
        }).catch((e) => {
            console.error(e);
            reject("Failed to upload image");
        })
    });
};

export function useUploadLocationImage() {
    const {call, ...rest} = useApiState(uploadLocationImage);

    return {
        uploadLocationImage: call,
        ...rest
    }
}
