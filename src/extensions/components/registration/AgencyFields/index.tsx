import React, { useEffect } from 'react';
import { FieldContext } from 'rc-field-form';
import {
	ConsultingTypeBasicInterface,
	AgencyDataInterface
} from '../../../../globalState/interfaces';
import { InputFormField } from '../InputFormField';
import { AgencySelection } from './AgencySelection';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../../components/text/Text';
import { useRegistrationSubmit } from '../FormAccordion/RegistrationSubmitContext';

interface AgencySelectionFormFieldProps {
	preselectedAgencies: AgencyDataInterface[];
	consultingType: ConsultingTypeBasicInterface;
	isActive?: boolean;
}

export const AgencySelectionFormField = ({
	consultingType,
	preselectedAgencies,
	isActive = false
}: AgencySelectionFormFieldProps) => {
	const field = React.useContext(FieldContext);
	const { t: translate } = useTranslation();
	const { mainTopicId, gender, age, counsellingRelation } =
		field.getFieldsValue();
	const { setAgencyStepIncomplete } = useRegistrationSubmit();

	const hasRequiredFields =
		!!(Number(mainTopicId) >= 0 && gender && age && counsellingRelation) ||
		preselectedAgencies.length > 0;

	// Only surface the warning icons on step 1 once the user has actually
	// opened step 2 ("Ihre Beratungsstelle in der Nähe") — not just because
	// this component is mounted while step 2 is still collapsed. Once
	// triggered, keep the warning visible even if step 2 is collapsed again
	// — it should only clear once the missing fields are actually filled in.
	useEffect(() => {
		if (hasRequiredFields) {
			setAgencyStepIncomplete(false);
		} else if (isActive) {
			setAgencyStepIncomplete(true);
		}
	}, [isActive, hasRequiredFields, setAgencyStepIncomplete]);

	return (
		<>
			{hasRequiredFields ? (
				<AgencySelection
					consultingType={consultingType}
					preselectedAgencies={preselectedAgencies}
				/>
			) : (
				<div className="registrationFormDigi__AgencyMandatoryFields">
					<Text
						type="standard"
						text={translate(
							'registrationDigi.agency.missingRequiredFields'
						)}
					/>
				</div>
			)}

			<InputFormField
				name="consultingTypeId"
				type="hidden"
				rule={{
					pattern: /^\d+$/
				}}
			/>
			<InputFormField name="postCode" type="hidden" />
			<InputFormField name="agencyId" type="hidden" />
		</>
	);
};
