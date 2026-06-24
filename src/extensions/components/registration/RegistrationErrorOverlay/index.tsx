import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BUTTON_TYPES } from '../../../../components/button/Button';
import {
	Overlay,
	OverlayItem,
	OVERLAY_FUNCTIONS
} from '../../../../components/overlay/Overlay';

export const RegistrationErrorOverlay = () => {
	const { t: translate } = useTranslation();

	const handleOverlayAction = useCallback((buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT_TO_URL) {
			window.location.href = '/login';
		}
	}, []);

	const overlayItemRegistrationError: OverlayItem = {
		illustrationBackground: 'error',
		headline: translate('registration.overlay.error.headline'),
		copy: translate('registration.overlay.error.copy'),
		buttonSet: [
			{
				label: translate('registration.overlay.error.button'),
				function: OVERLAY_FUNCTIONS.REDIRECT_TO_URL,
				type: BUTTON_TYPES.PRIMARY
			}
		]
	};

	return (
		<Overlay
			item={overlayItemRegistrationError}
			handleOverlay={handleOverlayAction}
		/>
	);
};
