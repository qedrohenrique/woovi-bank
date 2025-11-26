import { Observable, RequestParameters, Variables } from 'relay-runtime';
import { createClient } from 'graphql-ws';

const IS_SERVER = typeof window === typeof undefined;

const SUBSCRIPTIONS_ENPOINT = process.env
	.NEXT_PUBLIC_SUBSCRIPTIONS_ENDPOINT as string;

const subscriptionsClient = IS_SERVER
	? null
	: createClient({
			url: SUBSCRIPTIONS_ENPOINT,
	  });

function subscribe(
	operation: RequestParameters,
	variables: Variables
): Observable<any> {
	return Observable.create((sink) => {
		if (!subscriptionsClient) return;
		if (!operation.text) {
			return sink.error(new Error('Operation text cannot be empty'));
		}
		return subscriptionsClient.subscribe(
			{
				operationName: operation.name,
				query: operation.text,
				variables,
			},
			sink
		);
	});
}

export { subscribe };
