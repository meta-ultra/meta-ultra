import {
  PropsWithChildren,
  Children,
  cloneElement,
  isValidElement,
  FunctionComponentElement,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Form } from "antd";
import classNames from "classnames";
import { isElement, isFragment } from "react-is";
import useEvent from "react-use-event-hook";
import { ButtonMore } from "./buttons/ButtonMore";
import { useWindowResize } from "../../../hooks/useWindowResize";
import {
  useElements,
  ContextualReactNodesType,
} from "../../../hooks/useElements/useElements";
import { QuerySectionProvider } from "./useQuerySectionContext";
import { withInitialProps } from "../../../hocs/withInitialProps";

type QuerySectionProps<
  QueryType extends object,
  ContextType
> = PropsWithChildren<{
  initialValues?: QueryType;
  buttonMoreText?: string;
  className?: string;
  formClassName?: string;
  buttons?: ContextualReactNodesType<ContextType>;
}>;

const QuerySection = <QueryType extends object, ContextType>(
  props: QuerySectionProps<QueryType, ContextType>
) => {
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);

  // replace the antd table initialValues with custom one, to support async initialValues.
  useEffect(() => {
    if (form && props.initialValues) {
      form.setFieldsValue(props.initialValues);
    }
  }, [form, props.initialValues]);

  const [formItemCount, queries] = useMemo(() => {
    let children = props.children;
    if (isFragment(children) && children) {
      children = (children as { props: { children: ReactNode } }).props
        .children;
    }

    const queries = Children.toArray(children).map((child) => {
      if (isValidElement(child)) {
        return cloneElement(
          child as FunctionComponentElement<{ className: string }>,
          {
            className: "!mb-0",
          }
        );
      }

      return child;
    });

    return [Children.count(children), queries];
  }, [props.children]);

  const handleExpandToggle = useEvent(() => {
    setExpand(!expand);
  });

  const { width: screenWidth } = useWindowResize();
  const queryButtons = useElements(() => {
    if (props.buttons) {
      return {
        elements: (
          <>
            {props.buttons}
            {(screenWidth <= 640 && formItemCount > 2) || formItemCount > 4 ? (
              <ButtonMore
                key="more"
                text={props.buttonMoreText}
                onClick={handleExpandToggle}
                expand={expand}
              />
            ) : null}
          </>
        ),
      };
    }
    return [];
  }, [props.buttons, formItemCount, expand, handleExpandToggle, screenWidth]);

  return (
    <section
      className={classNames("flex gap-3 flex-col pt-2", props.className, {
        "lg:flex-row": formItemCount <= 2 && (props.buttons?.length || 0) <= 4,
      })}
    >
      <section className=" flex-0">
        <Form
          form={form}
          className={classNames(props.formClassName, {
            "grid gap-y-1 gap-x-4 md:gap-4 grid-cols-2":
              props.formClassName === undefined && formItemCount >= 2,
            "md:grid-cols-4":
              props.formClassName === undefined && formItemCount > 2,
          })}
        >
          {expand
            ? queries
            : queries.map((query, i) => {
                if (i < (screenWidth <= 640 ? 2 : 4)) {
                  return query;
                } else {
                  if (isElement(query)) {
                    return cloneElement(query, {
                      key: query.key ?? i,
                      style: { display: "none" },
                    });
                  } else {
                    return (
                      <span key={i} style={{ display: "none" }}>
                        {query}
                      </span>
                    );
                  }
                }
              })}
        </Form>
      </section>
      <section
        className={classNames(
          " flex-0 flex flex-row gap-3 items-center flex-wrap",
          {
            "sm:flex-nowrap": formItemCount <= 2,
          }
        )}
      >
        <QuerySectionProvider value={{ form, formItemCount }}>
          {queryButtons}
        </QuerySectionProvider>
      </section>
    </section>
  );
};

const QuerySectionWithInitialProps = withInitialProps(
  ["initialValues"],
  QuerySection
);

export type { QuerySectionProps };
export default QuerySectionWithInitialProps;
