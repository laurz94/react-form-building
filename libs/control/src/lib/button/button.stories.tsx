import type { Meta, StoryObj } from '@storybook/react';
import { LibButton } from './button';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof LibButton> = {
  component: LibButton,
  title: 'LibButton',
};
export default meta;
type Story = StoryObj<typeof LibButton>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to LibButton!/gi)).toBeTruthy();
  },
};
