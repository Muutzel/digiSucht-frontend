import React, { createContext, useContext, useState } from 'react';

interface RegistrationSubmitContextType {
	submitted: boolean;
	setSubmitted: (value: boolean) => void;
	agencyStepIncomplete: boolean;
	setAgencyStepIncomplete: (value: boolean) => void;
}

export const RegistrationSubmitContext =
	createContext<RegistrationSubmitContextType>({
		submitted: false,
		setSubmitted: () => {},
		agencyStepIncomplete: false,
		setAgencyStepIncomplete: () => {}
	});

export const useRegistrationSubmit = () =>
	useContext(RegistrationSubmitContext);

export const RegistrationSubmitProvider = ({
	children
}: {
	children: React.ReactNode;
}) => {
	const [submitted, setSubmitted] = useState(false);
	// Set to true once the user reaches the agency step (step 2) while
	// required fields from step 1 (age, gender, counsellingRelation,
	// mainTopicId) are still missing. Used to surface the warning icons
	// on the step 1 sub-steps without marking the whole form as submitted.
	const [agencyStepIncomplete, setAgencyStepIncomplete] = useState(false);
	return (
		<RegistrationSubmitContext.Provider
			value={{
				submitted,
				setSubmitted,
				agencyStepIncomplete,
				setAgencyStepIncomplete
			}}
		>
			{children}
		</RegistrationSubmitContext.Provider>
	);
};
