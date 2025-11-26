import { NextPage } from 'next';
import React, { useMemo } from 'react';
import { useRelayEnvironment } from 'react-relay';

export type NextPageWithLayout<T> = NextPage<T> & {
	getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export const RelayHydrate = <T,>({
	Component,
	props,
}: {
	Component: NextPageWithLayout<T>;
	props: any;
}) => {
	const environment = useRelayEnvironment();

	const getLayout = Component.getLayout ?? ((page) => page);

	const transformedProps = useMemo(() => {
		if (props == null) {
			return props;
		}
		const { preloadedQueries, ...otherProps } = props;
		if (preloadedQueries == null) {
			return props;
		}

		const queryRefs: any = {};
		for (const [queryName, { params, variables, response }] of Object.entries(
			preloadedQueries
		) as any) {
			environment
				.getNetwork()
				// @ts-ignore - seems to be a private untyped api 🤷‍♂️
				.responseCache.set(params.id, variables, response);
			queryRefs[queryName] = {
				environment,
				fetchKey: params.id,
				fetchPolicy: 'store-or-network',
				isDisposed: false,
				name: params.name,
				kind: 'PreloadedQuery',
				variables,
			};
		}

		return { ...otherProps, queryRefs };
	}, [props]);

	return <>{getLayout(<Component {...transformedProps} />)}</>;
};
