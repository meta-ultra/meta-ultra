import { ReactElement, useState } from "react";
import useEvent from "react-use-event-hook";
import { Modal, type UploadProps, type UploadFile } from "antd";
import { type RcFile } from "antd/lib/upload/interface";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const usePreview = (): [ReactElement, UploadProps["onPreview"]] => {
  const [previewImage, setPreviewImage] = useState<string>();
  const [previewTitle, setPreviewTitle] = useState<string>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const preview = useEvent(async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewTitle(
      file.name || (file.url ? file.url.substring(file.url.lastIndexOf("/") + 1) : "")
    );
    setPreviewOpen(true);
  });
  const handleCancel = useEvent(() => setPreviewOpen(false));

  const previewer = (
    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
      <img alt="preview" style={{ width: "100%" }} src={previewImage} />
    </Modal>
  );

  return [previewer, preview];
};

export { getBase64 };
export default usePreview;
