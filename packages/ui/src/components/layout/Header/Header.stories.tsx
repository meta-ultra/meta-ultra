import type { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";

const meta: Meta<typeof Header> = {
  title: "ui/Components/layout/Header",
  component: Header,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    return <Header count={args.count} onExit={args.onExit} />;
  },
};

export const CustomDropdownMenu: Story = {
  render: function Render(args) {
    return (
      <Header count={args.count} onExit={args.onExit}>
        <div>Notifications</div>
      </Header>
    );
  },
};
