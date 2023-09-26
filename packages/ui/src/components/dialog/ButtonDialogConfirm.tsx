import { FC, PropsWithChildren, useEffect, useState } from "react";
import { FormInstance, Button } from "antd";

type ButtonDialogConfirmProps = PropsWithChildren<{
  form: FormInstance;
  onLoading?: (loading: boolean) => void;
  onClick?: (values: Record<string, unknown>) => Promise<void>;
}>;

const ButtonDialogConfirm: FC<ButtonDialogConfirmProps> = (props) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const onLoading = props.onLoading;
    onLoading && onLoading(loading);
  }, [props.onLoading, loading]);

  return (
    <Button
      key="save"
      type="primary"
      loading={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const values = await props.form.validateFields();
          props.onClick && (await props.onClick(values));
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }}
    >
      {props.children}
    </Button>
  );
};

export default ButtonDialogConfirm;
