import React, { createContext, useContext, useState } from 'react';

interface RegistrationSubmitContextType {
	submitted: boolean;
	setSubmitted: (value: boolean) => void;
}

export const RegistrationSubmitContext =
	createContext<RegistrationSubmitContextType>({
		submitted: false,
		setSubmitted: () => {}
	});

export const useRegistrationSubmit = () =>
	useContext(RegistrationSubmitContext);

export const RegistrationSubmitProvider = ({
	children
}: {
	children: React.ReactNode;
}) => {
	const [submitted, setSubmitted] = useState(false);
	return (
		<RegistrationSubmitContext.Provider value={{ submitted, setSubmitted }}>
			{children}
		</RegistrationSubmitContext.Provider>
	);
};
