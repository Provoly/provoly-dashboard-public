import {
  Associations,
  Attribute,
  BusinessData,
  Category,
  Class,
  DatasetCount,
  Environment,
  Field,
  FieldType,
  IMetadata,
  Link,
  LinkDetails,
  MetadataUser,
  MetadataValue,
  Predicate,
  RelationType,
  UserInfo,
  VARIABLE_TYPE
} from '@provoly/dashboard';

export const envs: Environment[] = [{ type: VARIABLE_TYPE.STRING, name: 'myEnv', value: 'value' }];
export const preds: Predicate[] = [{ id: 'bc7eabc4-7e2b-44b8-a64b-712c1edd1ad2', name: 'reader', value: 'true' }];
export const metadata: IMetadata[] = [
  { name: 'meta', type: VARIABLE_TYPE.STRING, id: 'id', description: '', allowedValues: [] }
];

export const businessDatas: BusinessData[] = [
  {
    name: 'vehicule',
    count: 3,
    date: '01/01/01'
  }
];

export const mockDatasetsCounts: DatasetCount[] = [
  {
    id: '1234',
    count: 4
  }
];

export const attribute: Attribute = {
  id: 'id',
  name: 'attribute',
  field: 'fieldId',
  category: 'default',
  multiValued: false
};
export const classes: Class[] = [{ id: 'id', name: 'vehicule', attributes: [attribute] }];

export const field: Field = {
  id: 'fieldId',
  name: 'name',
  type: FieldType.STRING
};

export const category: Category = {
  id: 'uuiduuid-this-isis-mock-eduuiduuidaa',
  name: 'default'
};

export const users: UserInfo[] = [
  {
    id: 'idBuffy',
    claim: 'clame',
    name: 'Buffy',
    familyName: 'Summers',
    email: 'buffy.summers@sunnydale.fr',
    roles: ['pry-admin']
  }
];

export const metadataUser: MetadataUser[] = [
  {
    userProfile: {
      id: 'e1e55abd-2fb7-4e3b-9372-92c7c9d6c5c4',
      name: '_date_modification',
      type: VARIABLE_TYPE.STRING
    },
    value: '2022-05-12'
  }
];

export const relationTypes: RelationType[] = [
  {
    id: 'id1',
    name: 'Appartient à',
    nbRelation: 0,
    nbLink: 0,
    modificationDate: '',
    deletable: true
  }
];

export const linksDetails: LinkDetails[] = [
  {
    id: '334c1229-61e7-4807-aeaa-edaf16ec2274',
    relationType: {
      id: '2f021992-5fb0-42d3-9646-0affccb98105',
      name: 'est accidentée'
    },
    attributeSource: {
      id: '5b9d6408-ec70-461d-921f-88ef6ebb6cf6',
      name: 'id_mutation',
      field: '619c7c3c-070d-41d3-b61e-60ed854c39e2',
      category: 'cf666d66-838f-4d92-a4d2-a315df21fac8',
      multiValued: false
    },
    attributeDestination: {
      id: '3010e2c4-ef24-40fb-a72b-6757df8017f0',
      name: 'latitude',
      field: '59853619-9773-418a-ace5-70b80fd4dc74',
      category: 'cf666d66-838f-4d92-a4d2-a315df21fac9',
      multiValued: false
    }
  }
];

export const links: Link[] = [
  {
    id: '334c1229-61e7-4807-aeaa-edaf16ec2274',
    relationType: '2f021992-5fb0-42d3-9646-0affccb98105',
    attributeSource: '5b9d6408-ec70-461d-921f-88ef6ebb6cf6',
    attributeDestination: '3010e2c4-ef24-40fb-a72b-6757df8017f0'
  }
];

export const datasetMetadata: MetadataValue[] = [
  {
    metadataDef: {
      id: 'e1e55abd-2fb7-4e3b-9372-92c7c9d6c5c4',
      name: '_date_modification',
      type: VARIABLE_TYPE.STRING
    },
    value: '2022-05-12'
  }
];

export const associations: Associations = {
  id: 'Attribute123',
  associations: [
    {
      id: '12345',
      name: 'test association Attribute',
      type: 'dataset'
    }
  ],
  usedElsewhere: true
};
