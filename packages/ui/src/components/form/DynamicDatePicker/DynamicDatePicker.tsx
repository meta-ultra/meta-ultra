import { useState, useEffect } from "react";
import { Space, Select, DatePicker } from "antd";
import { Dayjs } from "dayjs";

interface DynamicDatePickerProps {
  value?: Dayjs;
  onTypeChange?: (type: "date" | "month" | "year") => void;
  onChange?: (value: unknown) => void;
}

const DynamicDatePicker = (props: DynamicDatePickerProps) => {
  const [type, setType] = useState<"date" | "month" | "year">("date");
  useEffect(() => {
    const onTypeChange = props.onTypeChange;
    onTypeChange && onTypeChange(type);
  }, [type, props.onTypeChange]);

  return (
    <Space>
      <Select value={type} onChange={setType}>
        <Select.Option key="date" value="date">
          日
        </Select.Option>
        <Select.Option key="month" value="month">
          月
        </Select.Option>
        <Select.Option key="year" value="year">
          年
        </Select.Option>
      </Select>
      <DatePicker
        value={props.value}
        picker={type}
        onChange={(value) => {
          if (props.onChange) {
            props.onChange(value);
          }
        }}
      />
    </Space>
  );
};

export type { DynamicDatePickerProps };
export default DynamicDatePicker;
