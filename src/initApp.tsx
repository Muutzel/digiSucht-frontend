import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app/app';
import { Stage } from './extensions/components/stage/stage';
import { config, routePathNames } from './extensions/resources/scripts/config';
import { Imprint } from './extensions/components/legalInformationLinks/Imprint';
import { Privacy } from './extensions/components/legalInformationLinks/Privacy';
import { TermsAndConditions } from './extensions/components/legalInformationLinks/TermsAndConditions';

ReactDOM.render(
	<App
		extraRoutes={[
			{
				route: { path: routePathNames.termsAndConditions },
				component: TermsAndConditions
			},
			{ route: { path: routePathNames.imprint }, component: Imprint },
			{ route: { path: routePathNames.privacy }, component: Privacy }
		]}
		stageComponent={Stage}
		legalLinks={[
			{
				url: routePathNames.imprint,
				label: 'login.legal.infoText.impressum'
			},
			{
				url: routePathNames.privacy,
				label: 'login.legal.infoText.dataprotection',
				registration: true
			}
		]}
		config={config}
	/>,
	document.getElementById('appRoot')
);
