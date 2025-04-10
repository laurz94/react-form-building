import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { LibNumber } from './number';

const meta: Meta<typeof LibNumber> = {
  component: LibNumber,
  title: 'LibNumber',
};
export default meta;
type Story = StoryObj<typeof LibNumber>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to LibNumber!/gi)).toBeTruthy();
  },
};
