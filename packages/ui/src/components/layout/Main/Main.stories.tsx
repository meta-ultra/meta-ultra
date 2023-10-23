import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import Main, { type Tab } from "./Main";

const meta: Meta<typeof Main> = {
  title: "Components/layout/Main",
  component: Main,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activeKey: "users",
    items: [
      { key: "dashboard", label: "Dashboard" },
      { key: "users", label: "Users" },
    ],
  },
  render: function Render(args) {
    const [{ activeKey, items }, updateArgs] = useArgs();

    return (
      <Main
        activeKey={activeKey}
        items={items}
        onTabClick={(activeKey) => updateArgs({ activeKey })}
        onRemove={(key) =>
          updateArgs({ items: items.filter((item: Tab) => item.key !== key) })
        }
      >
        Content: {items.find((item: Tab) => item.key === activeKey)?.label}
      </Main>
    );
  },
};
