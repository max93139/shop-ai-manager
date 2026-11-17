import type { IncomingMessage } from 'http';

/** Request with the unparsed JSON body kept by the json() middleware in main.ts. */
export type RawBodyRequest = IncomingMessage & { rawBody?: Buffer };
