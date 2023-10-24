import type { Meta, StoryObj } from "@storybook/react";
import LinkButton from "./LinkButton";
import { RiDeleteBin5Line, RiDeleteBin5Fill } from "react-icons/ri";

const meta: Meta<typeof LinkButton> = {
  title: "ui/Components/button/LinkButton",
  component: LinkButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "",
  },
};

export const Delete: Story = {
  args: {
    children: "Delete",
    icon: <RiDeleteBin5Line />,
    hoverIcon: <RiDeleteBin5Fill />,
    className: "text-red-500",
  },
};
