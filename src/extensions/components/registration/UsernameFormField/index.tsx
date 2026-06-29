import { Field } from 'rc-field-form';
import React from 'react';
import { RegistrationUsername } from '../../../../components/registration/RegistrationUsername';
import { isStringValidEmail } from '../../../../components/registration/registrationHelpers';

const LocalUsername = ({
	value,
	onChange,
	onEmailChange,
	isInUse
}: {
	isInUse?: boolean;
	onChange?: (value: string) => void;
	onEmailChange?: (value: string) => void;
	value?: string;
}) => (
	<RegistrationUsername
		isUsernameAlreadyInUse={isInUse}
		onUsernameChange={(username) => {
			if (value !== username) {
				onChange(username || '');
			}
		}}
		onValidityChange={() => null}
		onEmailChange={(email) => {
			if (onEmailChange) onEmailChange(email || '');
		}}
		onEmailValidityChange={() => null}
	/>
);

export const UsernameFormField = ({ inInUse }: { inInUse: boolean }) => {
	return (
		<>
			<Field name="username" rules={[{ required: true, min: 5 }]}>
				{({ value, onChange }) => (
					<Field
						name="email"
						rules={[
							{
								validator: (_, val) => {
									if (!val || val.length === 0)
										return Promise.resolve();
									if (isStringValidEmail(val))
										return Promise.resolve();
									return Promise.reject(
										new Error('Ungültige E-Mail-Adresse')
									);
								}
							}
						]}
					>
						{({ value: emailValue, onChange: onEmailChange }) => (
							<LocalUsername
								isInUse={inInUse}
								value={value}
								onChange={onChange}
								onEmailChange={onEmailChange}
							/>
						)}
					</Field>
				)}
			</Field>
		</>
	);
};
