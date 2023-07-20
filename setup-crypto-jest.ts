jest.mock('uuid');
import { v4 } from 'uuid';

// @ts-ignore
v4.mockImplementation(() => 'uuiduuid-this-isis-mock-eduuiduuidaa');
