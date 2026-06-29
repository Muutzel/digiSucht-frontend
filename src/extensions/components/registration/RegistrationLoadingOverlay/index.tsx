import * as React from 'react';
import { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import './registrationLoadingOverlay.styles.scss';

const REGISTRATION_TEXTS = [
	'Ihr Konto wird erstellt …',
	'Die Kontoerstellung kann einen Moment dauern…',
	'Einen Moment bitte…',
	"Gleich geht's weiter…",
	'Sie werden gleich weitergeleitet…'
];

const LOGIN_TEXTS = [
	'Ihre Daten werden geprüft…',
	'Sie werden angemeldet…',
	'Die Anmeldung kann einen Moment dauern…',
	'Einen Moment bitte…',
	"Gleich geht's weiter…"
];

const INTERVAL_MS = 5000;

interface LoadingOverlayProps {
	texts: string[];
}

const LoadingOverlay = ({ texts }: LoadingOverlayProps) => {
	const [textIndex, setTextIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setTextIndex((i) => (i + 1) % texts.length);
		}, INTERVAL_MS);
		return () => clearInterval(timer);
	}, [texts]);

	return ReactDOM.createPortal(
		<div className="registrationLoadingOverlay">
			<div className="registrationLoadingOverlay__content">
				<div
					className="registrationLoadingOverlay__spinner"
					aria-hidden="true"
				/>
				<p className="registrationLoadingOverlay__text">
					{texts[textIndex]}
				</p>
			</div>
		</div>,
		document.body
	);
};

export const RegistrationLoadingOverlay = () => (
	<LoadingOverlay texts={REGISTRATION_TEXTS} />
);

export const LoginLoadingOverlay = () => <LoadingOverlay texts={LOGIN_TEXTS} />;

export const LogoutLoadingOverlay = () => (
	<LoadingOverlay texts={['Sie werden abgemeldet. Einen Moment bitte…']} />
);
