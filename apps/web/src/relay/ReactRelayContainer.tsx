'use client';

import { ReactNode, Suspense, useMemo } from 'react';
import { ReactRelayContext } from 'react-relay';
import { createEnvironment } from './environment';

interface RelayProviderProps {
	children: ReactNode;
}

export function RelayProvider({ children }: RelayProviderProps) {
	const environment = useMemo(() => createEnvironment(), []);

	return (
		<ReactRelayContext.Provider value={{ environment }}>
			<Suspense fallback={<div>Carregando...</div>}>
				{children}
			</Suspense>
		</ReactRelayContext.Provider>
	);
}

export function ReactRelayContainer<T>({
	Component,
	props,
}: {
	Component: any;
	props: any;
}) {
	const environment = useMemo(() => createEnvironment(), []);
	return (
		<ReactRelayContext.Provider value={{ environment }}>
			<Suspense fallback={null}>
				<Component {...props} />
			</Suspense>
		</ReactRelayContext.Provider>
	);
}
