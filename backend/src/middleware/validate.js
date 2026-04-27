function translateIssue(issue) {
	// basic translation for common Zod issue codes
	const code = issue.code;
	// try to extract numeric params
	const minimum = issue.minimum ?? (issue.params && issue.params.minimum) ?? null;
	const maximum = issue.maximum ?? (issue.params && issue.params.maximum) ?? null;

	if (code === 'too_small') {
		if (minimum) return `Значение слишком короткое: минимум ${minimum} символов`;
		return 'Значение слишком короткое';
	}

	if (code === 'too_big' || code === 'too_large') {
		if (maximum) return `Значение слишком длинное: максимум ${maximum} символов`;
		return 'Значение слишком длинное';
	}

	if (code === 'invalid_string') {
		if (issue.validation === 'email') return 'Неверный формат email';
		return issue.message || 'Неверная строка';
	}

	if (code === 'invalid_type') {
		return 'Неверный тип данных';
	}

	// custom/refine messages - translate known ones
	if (issue.message) {
		if (issue.message.includes('Username is required')) return 'Требуется имя пользователя';
		if (issue.message.includes('Login is required')) return 'Требуется логин';
		// fallback: return the original message but in russian generic form
		return issue.message;
	}

	return 'Ошибка валидации';
}

function validate(schema, options = {}) {
	// options: { hideDetails: boolean }
	return (req, res, next) => {
		const result = schema.safeParse({
			body: req.body,
			params: req.params,
			query: req.query,
		});

		if (!result.success) {
			const issues = result.error.issues;

			// build flat object: { fieldName: message }
			const structured = {};

			for (const issue of issues) {
				// path: e.g. ['body','username'] or ['query','limit'] or []
				const path = Array.isArray(issue.path) && issue.path.length ? issue.path : ['body'];
				const loc = path[0] || 'body';
				const field = path.slice(1).join('.');
				const key = loc === 'body' ? field : `${loc}.${field}`;

				let message = translateIssue(issue);

				// if hideDetails flag is set (e.g., for login) then do not reveal specifics
				if (options.hideDetails) {
					message = 'Поле обязательно для заполнения';
				}

				if (key && !structured[key]) {
					structured[key] = message;
				}
			}

			return res.status(400).json({
				message: 'Ошибка валидации',
				issues: structured,
			});
		}

		req.validated = result.data;
		return next();
	};
}

module.exports = { validate };
