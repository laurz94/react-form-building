import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { LibDatePicker } from './date-picker';

const meta: Meta<typeof LibDatePicker> = {
  component: LibDatePicker,
  title: 'LibDatePicker',
};
export default meta;
type Story = StoryObj<typeof LibDatePicker>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to LibDatePicker!/gi)).toBeTruthy();
  },
};
