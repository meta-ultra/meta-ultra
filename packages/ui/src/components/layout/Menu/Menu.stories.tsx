import type { Meta, StoryObj } from "@storybook/react";
import Menu from "./Menu";

const meta: Meta<typeof Menu> = {
  title: "ui/Components/layout/Menu",
  component: Menu,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Admin",
    items: [
      {
        key: "users",
        label: "Users",
      },
    ],
  },
};
