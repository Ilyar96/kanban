import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { Theme } from '@/app/providers/ThemeProvider';
import { ThemeDecorator } from '@/shared/config/storybook/ThemeDecorator/ThemeDecorator';

const meta: Meta<typeof Checkbox> = {
  title: 'shared/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'fullscreen',
  },
  tags: [],
  decorators: [ThemeDecorator(Theme.LIGHT)],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

export const PrimaryDark: Story = {
  decorators: [ThemeDecorator(Theme.DARK)],
};
