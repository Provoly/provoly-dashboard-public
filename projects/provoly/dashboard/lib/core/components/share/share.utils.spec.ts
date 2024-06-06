import { AUTHENTICATED_USERS_GROUP, getCommonDatasourceGroupsForManifest, PUBLIC_GROUP } from './share.utils';
import { Dataset, Group, ManifestDescription } from '@provoly/dashboard';

const allGroups = [
  { name: PUBLIC_GROUP },
  { name: AUTHENTICATED_USERS_GROUP },
  { name: 'group1' },
  { name: 'group2' },
  { name: 'group3' },
  { name: 'group4' }
];

describe('ShareUtils', () => {
  describe('getCommonDatasourceGroupsForManifest', () => {
    const testCases = [
      {
        label: 'should return array with all available groups if all datasets are public',
        manifest: { datasource: ['ds1', 'ds2'] },
        datasets: [
          { id: 'ds1', groups: [PUBLIC_GROUP] },
          { id: 'ds2', groups: [PUBLIC_GROUP] }
        ],
        expected: allGroups.map((group) => group.name)
      },
      {
        label: 'should return a set of all common groups if all datasets are shared to authenticated users',
        manifest: { datasource: ['ds1', 'ds2'] },
        datasets: [
          { id: 'ds1', groups: [AUTHENTICATED_USERS_GROUP, 'group1'] },
          { id: 'ds2', groups: [AUTHENTICATED_USERS_GROUP, 'group2'] }
        ],
        expected: [AUTHENTICATED_USERS_GROUP, 'group1', 'group2', 'group3', 'group4']
      },
      {
        label:
          'should return a set of all common groups (without PUBLIC_GROUP) if all datasets are shared to authenticated users or public',
        manifest: { datasource: ['ds1', 'ds2'] },
        datasets: [
          { id: 'ds1', groups: [PUBLIC_GROUP, 'group1'] },
          { id: 'ds2', groups: [AUTHENTICATED_USERS_GROUP, 'group2'] }
        ],
        expected: [AUTHENTICATED_USERS_GROUP, 'group1', 'group2', 'group3', 'group4']
      },
      {
        label:
          'if one or more datasets are shared to authenticated users, it should return a set of the common groups of all the other datasets',
        manifest: { datasource: ['ds1', 'ds2', 'ds3'] },
        datasets: [
          { id: 'ds1', groups: [AUTHENTICATED_USERS_GROUP] },
          { id: 'ds2', groups: ['group2', 'group3'] },
          { id: 'ds3', groups: ['group3'] }
        ],
        expected: ['group3']
      },
      {
        label: 'should return all common groups between datasets',
        manifest: { datasource: ['ds1', 'ds2'] },
        datasets: [
          { id: 'ds1', groups: ['group1', 'group2', 'group3'] },
          { id: 'ds2', groups: ['group1', 'group2'] }
        ],
        expected: ['group1', 'group2']
      },
      {
        label: 'should return empty array if no common groups between datasets',
        manifest: { datasource: ['ds1', 'ds2'] },
        datasets: [
          { id: 'ds1', groups: ['group1'] },
          { id: 'ds2', groups: [] }
        ],
        expected: []
      },
      {
        label: 'should return empty array if no common groups between datasets',
        manifest: { datasource: ['ds1', 'ds2'] },
        datasets: [
          { id: 'ds1', groups: ['group1'] },
          { id: 'ds2', groups: ['group2'] }
        ],
        expected: []
      },
      {
        label: 'should return empty array if no common groups between datasets',
        manifest: { datasource: ['ds1', 'ds2', 'ds3'] },
        datasets: [
          { id: 'ds1', groups: [AUTHENTICATED_USERS_GROUP] },
          { id: 'ds2', groups: ['group2'] },
          { id: 'ds3', groups: ['group3'] }
        ],
        expected: []
      },
      {
        label: 'should return empty array if no common groups between datasets',
        manifest: { datasource: ['ds1', 'ds2', 'ds3'] },
        datasets: [
          { id: 'ds1', groups: [PUBLIC_GROUP] },
          { id: 'ds2', groups: ['group2'] },
          { id: 'ds3', groups: ['group3'] }
        ],
        expected: []
      },
      {
        label: 'should return empty array if all datasets are private',
        manifest: { datasource: ['ds1', 'ds2'] },
        datasets: [
          { id: 'ds1', groups: [] },
          { id: 'ds2', groups: [] }
        ],
        expected: []
      }
    ];

    testCases.forEach((testCase) => {
      it(testCase.label, () => {
        expect(
          getCommonDatasourceGroupsForManifest(
            testCase.manifest as ManifestDescription,
            testCase.datasets as Dataset[],
            allGroups as Group[]
          )
        ).toEqual(testCase.expected);
        // check if returned array only contains unique values
        expect(
          [
            ...new Set(
              getCommonDatasourceGroupsForManifest(
                testCase.manifest as ManifestDescription,
                testCase.datasets as Dataset[],
                allGroups as Group[]
              )
            )
          ].length
        ).toEqual(testCase.expected.length);
      });
    });
  });
});
