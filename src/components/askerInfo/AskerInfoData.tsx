import * as React from 'react';
import { useContext } from 'react';
import { handleNumericTranslation } from '../../utils/translate';
import {
	getContact,
	useConsultingType,
	ActiveSessionContext
} from '../../globalState';
import {
	convertUserDataObjectToArray,
	getUserDataTranslateBase
} from '../profile/profileHelpers';
import { Text } from '../text/Text';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

export const AskerInfoData = () => {
	const { t: translate } = useTranslation(['common', 'consultingTypes']);
	const { activeSession } = useContext(ActiveSessionContext);

	const consultingType = useConsultingType(activeSession.item.consultingType);

	const userSessionData = getContact(activeSession).sessionData;
	const preparedUserSessionData =
		convertUserDataObjectToArray(userSessionData);

	// Format date if it exists
	const formatDate = (dateString) => {
		if (!dateString) return '';
		try {
			return format(new Date(dateString), 'dd.MM.yyyy');
		} catch (e) {
			return dateString;
		}
	};

	return (
		<>
			<Text text={translate('userProfile.data.title')} type="divider" />
			<div className="askerInfo__data__item">
				<p className="askerInfo__data__label">
					{translate('userProfile.data.resort')}
				</p>
				<p className="askerInfo__data__content">
					{consultingType
						? translate(
								[
									`consultingType.${consultingType.id}.titles.default`,
									`consultingType.fallback.titles.default`,
									consultingType.titles.default
								],
								{ ns: 'consultingTypes' }
							)
						: ''}
				</p>
			</div>
			{/* Agency Name */}
			<div className="askerInfo__data__item">
				<p className="askerInfo__data__label">
					{translate('userProfile.data.agencyName')}
				</p>
				<p
					className={
						activeSession.item.agencyName
							? `askerInfo__data__content`
							: `askerInfo__data__content askerInfo__data__content--empty`
					}
				>
					{activeSession.item.agencyName ||
						translate('profile.noContent')}
				</p>
			</div>
			{/* Registration Date */}
			<div className="askerInfo__data__item">
				<p className="askerInfo__data__label">
					{translate('userProfile.data.createDate')}
				</p>
				<p
					className={
						activeSession.item.create_date
							? `askerInfo__data__content`
							: `askerInfo__data__content askerInfo__data__content--empty`
					}
				>
					{activeSession.item.create_date
						? formatDate(activeSession.item.create_date)
						: translate('profile.noContent')}
				</p>
			</div>
			{activeSession.item.consultingType === 0 &&
				!activeSession.isLive && (
					<div className="askerInfo__data__item">
						<p className="askerInfo__data__label">
							{translate('userProfile.data.postcode')}
						</p>
						<p className="askerInfo__data__content">
							{activeSession.item.postcode}
						</p>
					</div>
				)}
			{preparedUserSessionData.map((item, index) =>
				item.type === 'age' && item.value === 'null' ? null : (
					<div className="askerInfo__data__item" key={index}>
						<p className="askerInfo__data__label">
							{translate('userProfile.data.' + item.type)}
						</p>
						<p
							className={
								item.value
									? `askerInfo__data__content`
									: `askerInfo__data__content askerInfo__data__content--empty`
							}
						>
							{item.value
								? translate(
										handleNumericTranslation(
											getUserDataTranslateBase(
												activeSession.item
													.consultingType
											),
											item.type,
											item.value
										)
									)
								: translate('profile.noContent')}
						</p>
					</div>
				)
			)}
		</>
	);
};
