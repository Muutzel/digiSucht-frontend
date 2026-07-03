import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Banner } from '../banner/Banner';
import { UserDataContext } from '../../globalState';
import { useTranslation } from 'react-i18next';
import './noEmailBanner.styles.scss';

const LOCAL_STORAGE_KEY = 'hideNoEmailBanner';

const safeLocalStorage = {
	get: (key: string): string | null => {
		try {
			return localStorage.getItem(key);
		} catch {
			return null;
		}
	},
	set: (key: string, value: string): void => {
		try {
			localStorage.setItem(key, value);
		} catch {
			// storage blocked — banner will reappear on next visit, acceptable fallback
		}
	}
};

export const NoEmailBanner = () => {
	const [showBanner, setShowBanner] = useState<boolean>(false);
	const { t: translate } = useTranslation();
	const { userData } = useContext(UserDataContext);

	useEffect(() => {
		if (!userData) return;

		const isDismissed = safeLocalStorage.get(LOCAL_STORAGE_KEY) === 'true';
		const hasNoEmail = !userData.email;

		setShowBanner(hasNoEmail && !isDismissed);
	}, [userData]);

	useEffect(() => {
		const fn = showBanner ? 'add' : 'remove';
		document.body.classList[fn]('banner-open');
	}, [showBanner]);

	if (!showBanner) {
		return null;
	}

	return (
		<Banner
			className="no-email-banner"
			onClose={() => {
				safeLocalStorage.set(LOCAL_STORAGE_KEY, 'true');
				setShowBanner(false);
			}}
		>
			<p>
				{translate('noEmailBanner.textBeforeLink')}
				<Link to="/profile/allgemeines">
					{translate('noEmailBanner.profileLink')}
				</Link>
				{translate('noEmailBanner.textAfterLink')}
			</p>
		</Banner>
	);
};
