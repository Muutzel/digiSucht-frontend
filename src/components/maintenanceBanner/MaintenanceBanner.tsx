import * as React from 'react';
import { useEffect, useState } from 'react';
import { Banner } from '../banner/Banner';
import { useAppConfig } from '../../hooks/useAppConfig';
import './maintenanceBanner.styles.scss';

// Set via the FRONTEND_MAINTENANCE_BANNER_TEXT deploy environment variable
// (read by the proxy at runtime, not baked in at `npm run build`, unlike the
// REACT_APP_* settings). Leave unset / empty to hide the banner.
const isBannerTextSet = (text: string | undefined): boolean =>
	!!text && text.trim() !== '' && text.trim().toLowerCase() !== 'null';

export const MaintenanceBanner = () => {
	const settings = useAppConfig();
	const bannerText = settings?.maintenanceBanner?.text;
	const [showBanner, setShowBanner] = useState<boolean>(false);

	useEffect(() => {
		setShowBanner(isBannerTextSet(bannerText));
	}, [bannerText]);

	useEffect(() => {
		const fn = showBanner ? 'add' : 'remove';
		document.body.classList[fn]('banner-open');
	}, [showBanner]);

	if (!showBanner) {
		return null;
	}

	return (
		<Banner className="maintenance-banner">
			{/* Text comes from the FRONTEND_MAINTENANCE_BANNER_TEXT deploy
			env var and is rendered as HTML (e.g. `<br>` for line breaks),
			same as other trusted, ops-controlled strings in this app
			(see Text.tsx, Notification.tsx). Not sanitized - do not wire
			this up to any user-provided input. */}
			<p dangerouslySetInnerHTML={{ __html: bannerText }} />
		</Banner>
	);
};
