import { memo, useMemo } from "react";
import { Helmet } from "react-helmet-async";

interface SeoProps {
	title: string;
	description: string;
	noindex?: boolean;
}

const SITE_NAME = "Kanban";

export const Seo = memo((props: SeoProps) => {
	const { title, description, noindex = false } = props;

	const pageTitle = useMemo(() => `${title} | ${SITE_NAME}`, [title]);
	const robots = noindex ? "noindex, nofollow" : "index, follow";

	return (
		<Helmet prioritizeSeoTags>
			<title>{pageTitle}</title>
			<meta
				name="description"
				content={description}
			/>
			<meta
				name="robots"
				content={robots}
			/>
			<meta
				property="og:site_name"
				content={SITE_NAME}
			/>
			<meta
				property="og:title"
				content={pageTitle}
			/>
			<meta
				property="og:description"
				content={description}
			/>
			<meta
				property="og:type"
				content="website"
			/>
		</Helmet>
	);
});
