import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import Main, { type Tab } from "./Main";
import { useMemo } from "react";

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

export const ClosableTabs: Story = {
  args: {
    activeKey: "users",
    items: [
      { key: "dashboard", label: "Dashboard" },
      { key: "users", label: "Users" },
      { key: "roles", label: "Roles" },
    ],
  },
  render: function Render(args) {
    const [{ activeKey, items }, updateArgs] = useArgs();
    const content = useMemo(
      () => items?.find((item: Tab) => item.key === activeKey)?.label,
      [items, activeKey]
    );

    return (
      <Main
        activeKey={activeKey}
        items={items}
        onTabClick={(activeKey) => updateArgs({ activeKey })}
        onRemove={(key) =>
          updateArgs({ items: items.filter((item: Tab) => item.key !== key) })
        }
      >
        Active Tab: {content}
      </Main>
    );
  },
};

export const UnclosableTabs: Story = {
  args: {
    activeKey: "users",
    items: [
      { key: "dashboard", label: "Dashboard", closeIcon: <span /> },
      { key: "users", label: "Users", closeIcon: <span /> },
      { key: "roles", label: "Roles" },
    ],
  },
  render: function Render(args) {
    const [{ activeKey, items }, updateArgs] = useArgs();
    const content = useMemo(
      () => items?.find((item: Tab) => item.key === activeKey)?.label,
      [items, activeKey]
    );

    return (
      <Main
        activeKey={activeKey}
        items={items}
        onTabClick={(activeKey) => updateArgs({ activeKey })}
        onRemove={(key) =>
          updateArgs({ items: items.filter((item: Tab) => item.key !== key) })
        }
      >
        Active Tab: {content}
      </Main>
    );
  },
};
