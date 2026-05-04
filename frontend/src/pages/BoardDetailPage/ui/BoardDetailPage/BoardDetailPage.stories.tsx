import type { Meta, StoryObj } from '@storybook/react';
import BoardDetailPage from './BoardDetailPage';
import { Theme } from '@/app/providers/ThemeProvider';
import { ThemeDecorator } from '@/shared/config/storybook/ThemeDecorator/ThemeDecorator';

const meta: Meta<typeof BoardDetailPage> = {
  title: 'pages/BoardDetailPage',
  component: BoardDetailPage,
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
