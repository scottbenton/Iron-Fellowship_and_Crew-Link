import { ButtonBase } from "@mui/material";
import { PortraitAvatarDisplay } from "components/PortraitAvatar/PortraitAvatarDisplay";
import { PortraitUploaderDialog } from "components/PortraitUploaderDialog";
import { useField } from "formik";
import { useEffect, useState } from "react";

export interface ImageInputProps {
  name?: string;
}

export function ImageInput(props: ImageInputProps) {
  const { name } = props;

  const [dialogOpen, setDialogOpen] = useState(false);

  const [field, meta, handlers] = useField({ name: "portrait" });
  const [imageUrl, setImageUrl] = useState<string>();

  const file = field.value?.image;
  useEffect(() => {
    if (file && typeof file !== "string") {
      const reader = new FileReader();

      // Set up a function to run when the file is loaded
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Set the src attribute of the img element to the loaded image data
        const src = e.target?.result;
        if (typeof src === "string") {
          setImageUrl(src);
        }
      };

      // Read the selected file as a data URL
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div>
      <ButtonBase
        aria-label={"Upload a Character Portrait"}
        sx={(theme) => ({
          borderRadius: `${theme.shape.borderRadius}px`,
        })}
        onClick={() => setDialogOpen(true)}
      >
        <PortraitAvatarDisplay
          colorful
          size={"large"}
          name={name}
          portraitUrl={imageUrl}
          portraitSettings={
            field.value?.position &&
            field.value?.scale && {
              position: field.value.position,
              scale: field.value.scale,
            }
          }
        />
      </ButtonBase>
      <PortraitUploaderDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        handleUpload={(image, scale, position) => {
          handlers.setValue({
            image,
            scale,
            position,
          });
          return new Promise((res) => res());
        }}
        existingPortraitFile={undefined}
        existingPortraitSettings={undefined}
      />
    </div>
  );
}
