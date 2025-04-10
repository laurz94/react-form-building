import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { LibTextbox } from './textbox';

const meta: Meta<typeof LibTextbox> = {
  component: LibTextbox,
  title: 'LibTextbox',
};
export default meta;
type Story = StoryObj<typeof LibTextbox>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to LibTextbox!/gi)).toBeTruthy();
  },
};
