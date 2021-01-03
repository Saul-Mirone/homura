import { channel } from '../../src/channel/child';

jest.mock('../../src/channel/child');

export const mockChannel = (channel as unknown) as jest.Mocked<typeof channel>;
