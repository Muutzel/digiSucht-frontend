import * as React from 'react';
import { useEffect, useState } from 'react';
import {
	InputField,
	InputFieldItem,
	InputFieldLabelState
} from '../inputField/InputField';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import { ReactComponent as EnvelopeIcon } from '../../resources/img/icons/envelope.svg';
import {
	AccordionItemValidity,
	MIN_USERNAME_LENGTH,
	VALIDITY_INITIAL,
	VALIDITY_INVALID,
	VALIDITY_VALID,
	isStringValidEmail
} from './registrationHelpers';
import { Text } from '../text/Text';
import { useTranslation } from 'react-i18next';

interface RegistrationUsernameProps {
	isUsernameAlreadyInUse: boolean;
	onUsernameChange: Function;
	onEmailChange: Function;
	onValidityChange: Function;
	onEmailValidityChange: Function;
	onKeyDown?: Function;
}

export const RegistrationUsername = ({
	isUsernameAlreadyInUse,
	onUsernameChange,
	onEmailChange,
	onValidityChange,
	onEmailValidityChange,
	onKeyDown
}: RegistrationUsernameProps) => {
	const { t: translate } = useTranslation();
	const [username, setUsername] = useState<string>('');
	const [isValid, setIsValid] =
		useState<AccordionItemValidity>(VALIDITY_INITIAL);
	const [labelContent, setLabelContent] = useState<string>(null);
	const [labelState, setLabelState] = useState<InputFieldLabelState>(null);

	const [email, setEmail] = useState<string>('');
	const [emailLabelContent, setEmailLabelContent] = useState<string>(null);
	const [emailLabelState, setEmailLabelState] =
		useState<InputFieldLabelState>(null);

	useEffect(() => {
		if (isUsernameAlreadyInUse) {
			setIsValid(VALIDITY_INVALID);
			setLabelState(VALIDITY_INVALID);
			setLabelContent(translate('registration.user.unavailable'));
		}
	}, [isUsernameAlreadyInUse, translate]);

	useEffect(() => {
		onUsernameChange(username);
	}, [username]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		onEmailChange(email);
	}, [email]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		onValidityChange(isValid);
	}, [isValid]); // eslint-disable-line react-hooks/exhaustive-deps

	const inputItemUsername: InputFieldItem = {
		content: username,
		icon: <PersonIcon />,
		id: 'username',
		label: labelContent
			? `${labelContent}`
			: translate('registration.user.label'),
		maxLength: 30,
		name: 'username',
		type: 'text',
		...(labelState && { labelState: labelState })
	};

	const inputItemEmail: InputFieldItem = {
		content: email,
		icon: <EnvelopeIcon />,
		id: 'email',
		label: emailLabelContent
			? `${emailLabelContent}`
			: translate('registration.email.label'),
		name: 'email',
		type: 'text',
		...(emailLabelState && { labelState: emailLabelState })
	};

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handleUsernameBlur = (event) => {
		validateUsername(event.target.value);
	};

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handleEmailBlur = (event) => {
		validateEmail(event.target.value);
	};

	const validateUsername = (username) => {
		if (username.length >= MIN_USERNAME_LENGTH) {
			setIsValid(VALIDITY_VALID);
			setLabelState(VALIDITY_VALID);
			setLabelContent(translate('registration.user.suitable'));
		} else if (username.length > 0) {
			setIsValid(VALIDITY_INVALID);
			setLabelState(VALIDITY_INVALID);
			setLabelContent(translate('registration.user.unsuitable'));
		} else {
			setIsValid(VALIDITY_INITIAL);
			setLabelState(null);
			setLabelContent(null);
		}
	};

	const validateEmail = (value: string) => {
		if (value.length === 0) {
			// optional field — empty is fine
			setEmailLabelState(null);
			setEmailLabelContent(null);
			onEmailValidityChange(VALIDITY_VALID);
		} else if (isStringValidEmail(value)) {
			setEmailLabelState(VALIDITY_VALID);
			setEmailLabelContent(translate('registration.email.valid'));
			onEmailValidityChange(VALIDITY_VALID);
		} else {
			setEmailLabelState(VALIDITY_INVALID);
			setEmailLabelContent(translate('registration.email.invalid'));
			onEmailValidityChange(VALIDITY_INVALID);
		}
	};

	return (
		<div>
			<Text
				text={translate('registration.user.infoText')}
				type="standard"
				className="text__registration_user"
			/>
			<InputField
				item={inputItemUsername}
				inputHandle={handleUsernameChange}
				onBlur={handleUsernameBlur}
				onKeyDown={onKeyDown}
			/>
			<InputField
				item={inputItemEmail}
				inputHandle={handleEmailChange}
				onBlur={handleEmailBlur}
				onKeyDown={onKeyDown}
			/>
		</div>
	);
};
