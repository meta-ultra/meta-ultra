import type { Meta, StoryObj } from "@storybook/react";
import LinkUpdateButton from "./LinkUpdateButton";

const meta: Meta<typeof LinkUpdateButton> = {
  title: "ui/Components/button/LinkUpdateButton",
  component: LinkUpdateButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Delete: Story = {
  args: {
    text: "Update",
  },
};
