import * as React from 'react';
import { useEffect, useState } from 'react';
import './registrationLoadingOverlay.styles.scss';

const LOADING_TEXTS = [
	'Ihr Konto wird erstellt …',
	'Die Kontoerstellung kann einen Moment dauern…',
	'Einen Moment bitte…',
	'Gleich geht’s weiter…',
	'Sie werden gleich weitergeleitet…'
];

const INTERVAL_MS = 5000;

export const RegistrationLoadingOverlay = () => {
	const [textIndex, setTextIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setTextIndex((i) => (i + 1) % LOADING_TEXTS.length);
		}, INTERVAL_MS);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className="registrationLoadingOverlay">
			<div className="registrationLoadingOverlay__content">
				<div
					className="registrationLoadingOverlay__spinner"
					aria-hidden="true"
				/>
				<p className="registrationLoadingOverlay__text">
					{LOADING_TEXTS[textIndex]}
				</p>
			</div>
		</div>
	);
};
