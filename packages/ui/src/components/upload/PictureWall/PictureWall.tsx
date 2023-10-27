/**------------------------------------------------------------------------
 *                           PictureWall
 * PictureWall is on top of Antd Upload component(@see https://ant.design/components/upload/).
 *------------------------------------------------------------------------**/
import { FC, useMemo } from "react";
import { message, Upload } from "antd";
import { type RcFile, type UploadProps } from "antd/lib/upload/interface";
import useEvent from "react-use-event-hook";
import UploadButton, { type UploadButtonProps } from "./UploadButton";
import usePreview, { getBase64 } from "./usePreview";
import { isNil } from "lodash-es";

type MIME_IMAGE_TYPE =
  | "image/*"
  | "image/png"
  | "image/jpg"
  | "image/jpeg"
  | "image/bmp"
  | "image/pbm"
  | "image/webp";

type PictureWallProps = Pick<
  UploadProps,
  | "action"
  | "beforeUpload"
  | "customRequest"
  | "data"
  | "defaultFileList"
  | "directory"
  | "fileList"
  | "headers"
  | "iconRender"
  | "isImageUrl"
  | "itemRender"
  | "maxCount"
  | "method"
  | "multiple"
  | "progress"
  | "showUploadList"
  | "withCredentials"
  | "onChange"
  | "onRemove"
> & {
  [P in keyof UploadButtonProps as `uploadButton${Capitalize<P>}`]: UploadButtonProps[P];
} & {
  /**
   * Optional, the shape of image container.
   */
  listType?: "picture-card" | "picture-circle";
  /**
   * Optional, read-only or not.
   */
  readOnly?: boolean;
  /**
   * Optional, similar to the "accept" attribute of native file tag with limited options.
   */
  accept?: MIME_IMAGE_TYPE | MIME_IMAGE_TYPE[];
  acceptMessage?: string;
  /**
   * Optional, maximum size of file in byte, defaults to no limitation.
   */
  maxSize?: number;
  maxSizeMessage?: string | { (actualSize: number): string };
  dimension?: Dimension;
  dimensionMessage?: string | { (actualWidth: number, actualHeight: number): string };
};

type Dimension = {
  width?: number;
  height?: number;
  ratio?: number;
};

const PictureWall: FC<PictureWallProps> = ({
  /**----------------------
   *    Upload Props
   *------------------------**/
  action,
  beforeUpload,
  customRequest,
  data,
  defaultFileList,
  directory,
  fileList,
  headers,
  iconRender,
  isImageUrl,
  itemRender,
  maxCount = 5,
  method,
  multiple,
  progress,
  showUploadList,
  withCredentials,
  onChange,
  onRemove,
  /**----------------------
   *    UploadButton Props
   *------------------------**/
  uploadButtonText,
  uploadButtonIconSize,
  /**----------------------
   *    PictureWall Own Props
   *------------------------**/
  listType = "picture-card",
  readOnly = false,
  accept = "image/*",
  acceptMessage = "Select an image please.",
  maxSize,
  maxSizeMessage,
  dimension,
  dimensionMessage,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const uploadButton = useMemo(() => {
    if (readOnly || (fileList && fileList.length >= maxCount)) {
      return null;
    } else {
      return <UploadButton text={uploadButtonText} iconSize={uploadButtonIconSize} />;
    }
  }, [fileList, maxCount, readOnly, uploadButtonText, uploadButtonIconSize]);

  const [previewer, preview] = usePreview();

  /**------------------------------------------------------------------------
   *                           VALIDATION START
   *------------------------------------------------------------------------**/
  const validateMIME = useEvent(async (file: RcFile) => {
    if (typeof accept === "string") {
      accept = [accept];
    }

    let pass = false;
    for (let i = 0; !pass && i < accept.length; i++) {
      const mime = accept[i];
      if (mime) {
        const reMime = new RegExp(`^${mime.replace("*", ".+")}$`);
        pass = reMime.test(file.type);
      }
    }

    if (!pass) {
      throw { name: "ERR_MIME" };
    }
  });

  const validateSize = useEvent(async (file: RcFile) => {
    if (typeof maxSize === "number" && file.size > maxSize) {
      throw { name: "ERR_MAX_SIZE", value: file.size };
    } else {
      return;
    }
  });

  const sleep = (ms = 16) => {
    return new Promise((resolve) => setTimeout(resolve, Math.max(ms, 16)));
  };

  const validateDimension = useEvent(async (file: RcFile) => {
    if (
      dimension &&
      (!isNil(dimension.height) || !isNil(dimension.width) || !isNil(dimension.ratio))
    ) {
      const dataUrl = await getBase64(file);
      const img = new Image();
      img.src = dataUrl;
      await sleep();
      const { naturalWidth: width, naturalHeight: height } = img;

      if (!isNil(dimension.height) && height !== dimension.height) {
        throw { name: "ERR_DIMENSION", value: { width, height } };
      }
      if (!isNil(dimension.width) && height !== dimension.width) {
        throw { name: "ERR_DIMENSION", value: { width, height } };
      }
      // ! Width / Height is error-prone
      if (!isNil(dimension.ratio) && width / height !== dimension.ratio) {
        throw { name: "ERR_DIMENSION", value: { width, height } };
      }
    }
  });

  const handleBeforeUpload = useEvent(async (file: RcFile, fileList: RcFile[]) => {
    try {
      await validateMIME(file);
      await validateSize(file);
      await validateDimension(file);
      //! WARNING change in the future
      if (beforeUpload) {
        return beforeUpload(file, fileList);
      }

      return true;
    } catch (e) {
      let content;
      switch ((e as Error).name) {
        case "ERR_MIME":
          content = acceptMessage;
          break;
        case "ERR_MAX_SIZE":
          content =
            maxSizeMessage == undefined
              ? void 0
              : typeof maxSizeMessage === "string"
              ? maxSizeMessage
              : maxSizeMessage((e as { value: number }).value);
          break;
        case "ERR_DIMENSION":
          content =
            dimensionMessage == undefined
              ? void 0
              : typeof dimensionMessage === "string"
              ? dimensionMessage
              : dimensionMessage(
                  (e as { value: { width: number; height: number } }).value.width,
                  (e as { value: { width: number; height: number } }).value.height
                );
          break;
      }
      if (content) {
        messageApi.error({ content });
      }

      return Upload.LIST_IGNORE;
    }
  });
  /*---------------------------- END OF VALIDATION ----------------------------*/

  return (
    <>
      {contextHolder}
      {previewer}
      <Upload
        action={action}
        customRequest={customRequest}
        data={data}
        defaultFileList={defaultFileList}
        directory={directory}
        fileList={fileList}
        headers={headers}
        iconRender={iconRender}
        isImageUrl={isImageUrl}
        itemRender={itemRender}
        method={method}
        multiple={multiple}
        progress={progress}
        showUploadList={showUploadList}
        withCredentials={withCredentials}
        onChange={onChange}
        onRemove={onRemove}
        disabled={readOnly}
        listType={listType}
        beforeUpload={handleBeforeUpload}
        onPreview={preview}
      >
        {uploadButton}
      </Upload>
    </>
  );
};

export type { PictureWallProps, MIME_IMAGE_TYPE };
export default PictureWall;
