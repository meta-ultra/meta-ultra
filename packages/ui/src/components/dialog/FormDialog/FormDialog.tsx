import { ReactNode, memo, useState, useMemo, forwardRef, useImperativeHandle } from "react";
import { Form, Button, FormInstance } from "antd";
import useEvent from "react-use-event-hook";
import Dialog, { DialogProps } from "../Dialog";
import ButtonDialogConfirm from "../ButtonDialogConfirm";
import { FormDialogContextProvider } from "./useFormDialog";
import useElements from "../../../hooks/useElements/useElements";
import { createPropertySetterModifier } from "../../../hooks/useElements/modifiers/createPropertySetterModifier";

interface FormDialogProps<RecordType extends object = object> extends DialogProps {
  textCancel?: string;
  textConfirm?: string;
  record?: RecordType;
}

interface FormDialogContentProps<RecordType extends object = object> {
  children?: ReactNode;
  form: FormInstance;
  record?: RecordType;
}
const FormDialogContent = memo(({ children, form, record }: FormDialogContentProps) => {
  const context = Dialog.useDialogContext();
  const formContext = useMemo(
    () => ({
      record,
      form,
      ...context,
    }),
    [context, form, record]
  );

  return (
    <Form form={form}>
      <FormDialogContextProvider value={formContext}>{children}</FormDialogContextProvider>
    </Form>
  );
});
FormDialogContent.displayName = "FormDialogContent";

const FormDialog = forwardRef<FormInstance, FormDialogProps>((props, ref) => {
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => form, [form]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleCreateDialogClose = useEvent(() => {
    if (confirmLoading) return;

    form.resetFields();
    props.onClose();
  });

  // TODO: issue - a brand new footer would be created when any props of button changes.
  const footer = useElements(
    () => ({
      elements: (
        <>
          {props.footer}
          {props.footer && props.footer.cancel === false ? null : (
            <Button key="cancel" onClick={handleCreateDialogClose} disabled={confirmLoading}>
              {props.textCancel}
            </Button>
          )}
          {props.footer && props.footer.confirm === false ? null : (
            <ButtonDialogConfirm key="confirm" form={form} onLoading={setConfirmLoading}>
              {props.textConfirm}
            </ButtonDialogConfirm>
          )}
        </>
      ),
      context:
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (props.footer && typeof props.footer == "object" && (props.footer as any).context) ||
        undefined,
      // TODO: merge event listeners
      modifiers: [
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...((props.footer && typeof props.footer == "object" && (props.footer as any).modifiers) ||
          []),
        createPropertySetterModifier(["onClick"]),
      ],
    }),
    [props.footer, props.textCancel, props.textConfirm]
  );

  return (
    <Dialog
      title={props.title}
      visible={props.visible}
      width={props.width}
      tip={props.tip}
      footer={footer}
      onClose={handleCreateDialogClose}
    >
      <FormDialogContent form={form} record={props.record}>
        {props.children}
      </FormDialogContent>
    </Dialog>
  );
});
FormDialog.displayName = "FormDialog";

export type { FormDialogProps };
export default FormDialog;
