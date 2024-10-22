import { DateUtils } from '@provoly/dashboard';

describe('DateUtils functions', () => {
  describe('parseToIsoString', () => {
    [
      {
        inputDate: '2024-12-31',
        expectedResult: '2024-12-31T00:00:00.000Z'
      },
      {
        inputDate: '12/31/2024',
        expectedResult: ['2024-12-31T00:00:00.000Z', '2024-12-30T23:00:00.000Z', '2024-12-30T22:00:00.000Z']
      },
      {
        inputDate: '2025',
        expectedResult: '2025-01-01T00:00:00.000Z'
      }
    ].forEach((datas) => {
      it(`should parse ${datas.inputDate} to ISO-8601 date => ${datas.expectedResult}`, () => {
        const result = DateUtils.parseToIsoString(datas.inputDate);
        if (Array.isArray(datas.expectedResult)) {
          expect(datas.expectedResult).toContain(result);
        } else {
          expect(result).toEqual(datas.expectedResult);
        }
      });
    });

    it(`should parse invalid date without error`, () => {
      // invalid date as format is MM/DD/YYYY
      const result = DateUtils.parseToIsoString('31/12/2025');
      expect(result).toEqual('');
    });
  });
});
