const namePrompt = (name) => ({
	type: 'input',
	name,
	message: 'Name (PascalCase):',
	validate: (value) => {
		if (!value) {
			return 'Name is required';
		}

		if (!/^[A-Z][A-Za-z0-9]*$/.test(value)) {
			return 'Use PascalCase, e.g. UserCard';
		}

		return true;
	},
});

const domainFolders = {
	entity: 'entities',
	feature: 'features',
	page: 'pages',
	widget: 'widgets',
};

const createDomainActions = (domain, nameKey) => [
	{
		type: 'add',
		path: `src/${domainFolders[domain]}/{{pascalCase ${nameKey}}}/index.ts`,
		templateFile: `templates/${domain}/index.ts.hbs`,
	},
	{
		type: 'add',
		path: `src/${domainFolders[domain]}/{{pascalCase ${nameKey}}}/model/selectors/.gitkeep`,
		template: '',
	},
	{
		type: 'add',
		path: `src/${domainFolders[domain]}/{{pascalCase ${nameKey}}}/model/services/.gitkeep`,
		template: '',
	},
	{
		type: 'add',
		path: `src/${domainFolders[domain]}/{{pascalCase ${nameKey}}}/model/types/index.ts`,
		templateFile: `templates/${domain}/types-index.ts.hbs`,
	},
	{
		type: 'add',
		path: `src/${domainFolders[domain]}/{{pascalCase ${nameKey}}}/model/slice/{{camelCase ${nameKey}}}Slice.ts`,
		templateFile: `templates/${domain}/slice.ts.hbs`,
	},
	{
		type: 'add',
		path: `src/${domainFolders[domain]}/{{pascalCase ${nameKey}}}/ui/{{pascalCase ${nameKey}}}/{{pascalCase ${nameKey}}}.tsx`,
		templateFile: `templates/${domain}/${domain === 'entity' ? 'Entity' : domain === 'feature' ? 'Feature' : 'Page'}.tsx.hbs`,
	},
	{
		type: 'add',
		path: `src/${domainFolders[domain]}/{{pascalCase ${nameKey}}}/ui/{{pascalCase ${nameKey}}}/{{pascalCase ${nameKey}}}.module.scss`,
		templateFile: `templates/${domain}/${domain === 'entity' ? 'Entity' : domain === 'feature' ? 'Feature' : 'Page'}.module.scss.hbs`,
	},
	{
		type: 'add',
		path: `src/${domainFolders[domain]}/{{pascalCase ${nameKey}}}/ui/{{pascalCase ${nameKey}}}/{{pascalCase ${nameKey}}}.stories.tsx`,
		templateFile: `templates/${domain}/${domain === 'entity' ? 'Entity' : domain === 'feature' ? 'Feature' : 'Page'}.stories.tsx.hbs`,
	},
];

module.exports = function (plop) {
	plop.setGenerator('shared-component', {
		description: 'Create shared UI component',
		prompts: [namePrompt('componentName')],
		actions: [
			{
				type: 'add',
				path: 'src/shared/ui/{{pascalCase componentName}}/{{pascalCase componentName}}.tsx',
				templateFile: 'templates/shared-component/Component.tsx.hbs',
			},
			{
				type: 'add',
				path: 'src/shared/ui/{{pascalCase componentName}}/{{pascalCase componentName}}.module.scss',
				templateFile: 'templates/shared-component/Component.module.scss.hbs',
			},
			{
				type: 'add',
				path: 'src/shared/ui/{{pascalCase componentName}}/{{pascalCase componentName}}.stories.tsx',
				templateFile: 'templates/shared-component/Component.stories.tsx.hbs',
			},
		],
	});

	plop.setGenerator('entity', {
		description: 'Create entity slice + UI',
		prompts: [namePrompt('entityName')],
		actions: createDomainActions('entity', 'entityName'),
	});

	plop.setGenerator('feature', {
		description: 'Create feature slice + UI',
		prompts: [namePrompt('featureName')],
		actions: createDomainActions('feature', 'featureName'),
	});

	plop.setGenerator('page', {
		description: 'Create page with lazy export',
		prompts: [namePrompt('pageName')],
		actions: [
			...createDomainActions('page', 'pageName'),
			{
				type: 'add',
				path: 'src/pages/{{pascalCase pageName}}/ui/{{pascalCase pageName}}/{{pascalCase pageName}}.async.tsx',
				templateFile: 'templates/page/Page.async.tsx.hbs',
			},
		],
	});

	plop.setGenerator('widget', {
		description: 'Create widget',
		prompts: [namePrompt('widgetName')],
		actions: [
			{
				type: 'add',
				path: 'src/widgets/{{pascalCase widgetName}}/index.ts',
				templateFile: 'templates/widget/index.ts.hbs',
			},
			{
				type: 'add',
				path: 'src/widgets/{{pascalCase widgetName}}/ui/{{pascalCase widgetName}}.tsx',
				templateFile: 'templates/widget/Widget.tsx.hbs',
			},
			{
				type: 'add',
				path: 'src/widgets/{{pascalCase widgetName}}/ui/{{pascalCase widgetName}}.module.scss',
				templateFile: 'templates/widget/Widget.module.scss.hbs',
			},
			{
				type: 'add',
				path: 'src/widgets/{{pascalCase widgetName}}/ui/{{pascalCase widgetName}}.stories.tsx',
				templateFile: 'templates/widget/Widget.stories.tsx.hbs',
			},
		],
	});
};
