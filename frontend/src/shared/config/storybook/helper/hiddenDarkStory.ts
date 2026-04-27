import { ThemeDecorator } from "../ThemeDecorator/ThemeDecorator";
import { Theme } from "../ThemeDecorator/theme";

type HiddenDarkStoryLike = {
	name?: string;
	tags?: readonly string[];
	decorators?: unknown;
};

export function createHiddenDarkStory<Story extends HiddenDarkStoryLike>(
	story: Story,
	darkName?: string,
): Story {
	const storyDecorators = Array.isArray(story.decorators)
		? story.decorators
		: story.decorators
			? [story.decorators]
			: [];
	const hiddenDarkName = darkName ?? (story.name ? `${story.name}Dark` : "Dark");

	return {
		...story,
		name: hiddenDarkName,
		tags: [...(story.tags ?? []), "!dev"],
		decorators: [...storyDecorators, ThemeDecorator(Theme.DARK)],
	} as Story;
}
