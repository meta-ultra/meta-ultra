import { FC, ReactNode } from "react";
import { Modal, Spin, Skeleton } from "antd";
import { DialogContextProvider } from "./useDialogContext";
import { useLoading } from "../../../hooks/useLoading";

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
  const [loading, children, context] = useLoading(
    props.visible,
    props.children
  );

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
        {children ? (
          <DialogContextProvider value={context}>
            {children}
          </DialogContextProvider>
        ) : (
          <Skeleton active />
        )}
      </Spin>
    </Modal>
  );
};

export type { DialogProps };
export default Dialog;
