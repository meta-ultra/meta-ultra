import { FC } from "react";
import { AiOutlinePlus } from "react-icons/ai";

interface UploadButtonProps {
  text?: string;
  iconSize?: number;
}

const UploadButton: FC<UploadButtonProps> = ({ text = "Upload", iconSize = 18 }) => (
  <div className=" text-center">
    <AiOutlinePlus className="inline-block" size={iconSize} />
    <div style={{ marginTop: 8 }}>{text}</div>
  </div>
);

export type { UploadButtonProps };
export default UploadButton;
