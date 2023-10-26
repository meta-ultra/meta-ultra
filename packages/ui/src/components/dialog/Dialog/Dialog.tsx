import { FC, ReactNode } from "react";
import { Modal, Spin, Skeleton } from "antd";
import { DialogContextProvider } from "./useDialogContext";
import useLoading from "../../../hooks/useLoading";
import "./Dialog.css";

interface DialogProps {
  title: string;
  tip?: string;
  visible: boolean;
  children?: ReactNode;
  width?: number | string;
  footer?: ReactNode;
  onClose: () => void;
}

const Dialog: FC<DialogProps> = (props) => {
  const [loading, children, context] = useLoading(props.visible, props.children);

  return (
    <Modal
      title={props.title}
      maskClosable={false}
      open={props.visible}
      centered
      destroyOnClose
      width={props.width}
      onCancel={props.onClose}
      footer={props.footer || null}
    >
      <Spin tip={props.tip} spinning={loading}>
        <div className="mu-dialog__body">
          {children ? (
            <DialogContextProvider value={context}>{children}</DialogContextProvider>
          ) : (
            <Skeleton active />
          )}
        </div>
      </Spin>
    </Modal>
  );
};

export type { DialogProps };
export default Dialog;
