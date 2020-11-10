import { channel } from '../../app/channel/child';

jest.mock('../../app/channel/child');

export const mockChannel = (channel as unknown) as jest.Mocked<typeof channel>;
