import type { Meta, StoryObj } from "@storybook/react";
import LinkDeleteButton from "./LinkDeleteButton";

const meta: Meta<typeof LinkDeleteButton> = {
  title: "ui/Components/button/LinkDeleteButton",
  component: LinkDeleteButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Delete: Story = {
  args: {
    text: "Delete",
  },
};
