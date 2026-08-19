import * as React from 'react';
import { useEffect, useState } from 'react';
import { Banner } from '../banner/Banner';
import { useTranslation } from 'react-i18next';
import './maintenanceBanner.styles.scss';

// After this date the banner will no longer be shown.
// Adjust when scheduling a new maintenance window.
const MAINTENANCE_BANNER_VISIBLE_UNTIL = new Date('2026-09-02T00:00:00');

export const MaintenanceBanner = () => {
	const [showBanner, setShowBanner] = useState<boolean>(false);
	const { t: translate } = useTranslation();

	useEffect(() => {
		setShowBanner(new Date() <= MAINTENANCE_BANNER_VISIBLE_UNTIL);
	}, []);

	useEffect(() => {
		const fn = showBanner ? 'add' : 'remove';
		document.body.classList[fn]('banner-open');
	}, [showBanner]);

	if (!showBanner) {
		return null;
	}

	return (
		<Banner className="maintenance-banner">
			<p>{translate('maintenanceBanner.text')}</p>
		</Banner>
	);
};
