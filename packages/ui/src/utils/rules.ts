interface RuleOption {
  required?: boolean;
  warningOnly?: boolean;
  message?: string;
}

const DEFAULT_OPTION = { required: false, message: "", warningOnly: false };

const createRule = (predicate: (value: string) => boolean, defaultMessasge?: string) => {
  return (option: RuleOption = {}) => {
    option = Object.assign({}, DEFAULT_OPTION, option);

    return {
      required: option.required,
      warningOnly: option.warningOnly,
      async validator(rule: any, value: string | undefined) {
        if ((rule.required && !value) || (value && !predicate(String(value)))) {
          throw option.message || defaultMessasge;
        }
      },
    };
  };
};

const isMobilePhonePredicate = (value: string) =>
  /^(13[0-9]|14[014-9]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value);
const isMobilePhone = createRule(isMobilePhonePredicate, "请输入有效的手机号码");

const isValidAccountPredicate = (value: string) => /^[a-z][a-z\d_-]*$/.test(value);
const isValidAccount = createRule(
  isValidAccountPredicate,
  "请输入字母开头，由字母数字组成的账号，如：zhangsan1"
);

export { createRule, isMobilePhone, isValidAccount };
