import { memo, useEffect, useState } from "react";
import { Button } from "@/shared/ui/Button/Button";
import { classNames } from "@/shared/lib/classNames/classNames";
import { getCookie, setCookie } from "@/shared/lib/cookies";
import {
	COOKIE_CONSENT_ACCEPTED_VALUE,
	COOKIE_CONSENT_KEY,
} from "@/shared/const/cookie";
import cls from "./CookieConsent.module.scss";

const CONSENT_TTL_DAYS = 365;

export const CookieConsent = memo(() => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const consentCookie = getCookie(COOKIE_CONSENT_KEY);
		const consentStorage = localStorage.getItem(COOKIE_CONSENT_KEY);
		const isAccepted =
			consentCookie === COOKIE_CONSENT_ACCEPTED_VALUE ||
			consentStorage === COOKIE_CONSENT_ACCEPTED_VALUE;

		setIsVisible(!isAccepted);
	}, []);

	const onAcceptHandler = () => {
		setCookie(COOKIE_CONSENT_KEY, COOKIE_CONSENT_ACCEPTED_VALUE, CONSENT_TTL_DAYS);
		localStorage.setItem(COOKIE_CONSENT_KEY, COOKIE_CONSENT_ACCEPTED_VALUE);
		setIsVisible(false);
	};

	if (!isVisible) {
		return null;
	}

	return (
		<div className={classNames(cls.cookieConsent)}>
			<div className={cls.content}>
				<p className={cls.text}>
					Мы используем cookie для корректной работы сайта, авторизации и улучшения
					пользовательского опыта.
				</p>
				<Button
					className={cls.acceptBtn}
					theme="backgroundInverted"
					onClick={onAcceptHandler}
				>
					Принять
				</Button>
			</div>
		</div>
	);
});
