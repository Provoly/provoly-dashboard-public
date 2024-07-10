export const enTranslations = {
  '@pry': {
    admin: {
      title: 'Administration',
      titleIndication: 'Close Administration menu ',
      infoModalTitle: 'Information',
      closeModale: 'Close',
      edit: 'Edit',
      rename: 'Rename',
      delete: 'Delete',
      add: 'New',
      validate: 'Validate',
      addClass: 'Validate creation',
      addAttribute: 'Add attribute',
      create: 'Create',
      upload: 'Add a picture',
      cancel: 'Cancel',
      back: 'Back',
      next: 'Next',
      properties: 'Properties',
      details: 'Details',
      activity: 'Activity',
      required: 'This field is required',
      exists: 'This name already exists',
      minLength: 'The minimum number of characters: {{len}}',
      maxLength: 'Number of characters allowed: {{len}}',
      noWhitespace: "The value can't start or end with a blank space",
      rule: 'Rule n°{{id}}',
      defaultRule: 'Default Rule (applies only if no other rules are verified)',
      displayModeImage: 'Image display mode',
      size: 'Image size',
      share: 'Share',
      deleteAttributeConfirmMessage:
        'This attribute will no longer be visible for the associated data. Are you sure you want to delete this?',
      attributes: {
        unknownField: 'Unknown field',
        unknownCategory: 'Unknown category',
        noCategory: 'No category'
      },
      position: {
        FULL: 'Full icon',
        TOP_LEFT: 'Top left',
        TOP_RIGHT: 'Top Right',
        BOTTOM_LEFT: 'Bottom left',
        BOTTOM_RIGHT: 'Bottom right'
      },
      customize: {
        title: 'Customize',
        template: 'Tooltip (Map & Relations)',
        update: 'Update tooltip',
        advanced: 'Advanced mode',
        name: 'Business model',
        technicalId: 'Technical Id',
        type: 'Choose which kind of tooltip to use',
        simplified: 'Choose which attributes to display',
        exemple: '{{expr}} value',
        table: 'Table default attributes',
        tile: 'Tile default attributes',
        tileHint: 'Only between 1 and {{max}} attributes can be displayed in a tile',
        tableAttrs: 'Attributes in a table by default',
        tileAttrs: 'Attributes displayed in a tile',
        noTableAttrs: 'Other attributes',
        noTileAttrs: 'Attributes not displayed',
        updateTable: 'Update default table attributes',
        updateTile: 'Update tile attributes',
        updateIcons: 'Update symbols rules'
      },
      varType: {
        int: 'Integer',
        double: 'Double',
        string: 'Text',
        uuid: 'Uuid',
        date: 'Date',
        list: 'Value list'
      },
      menus: {
        environment: 'Execution contexts',
        user: 'Users',
        'metadata-user': 'User profile',
        'abac-rules': 'ABAC Rules',
        'metadata-rules': 'Rules metadata',
        dataset: 'Datasets',
        classes: 'Classes',
        predicates: 'Predicates',
        metadata: 'Metadata',
        fields: 'Fields',
        'relation-types': 'Relation types',
        links: 'Links between attributes',
        model: 'Data model',
        access: 'Data access'
      },
      predicates: {
        list: 'Predicates',
        add: 'Create new predicate',
        edit: 'Edit un predicate',
        info: "Predicate's information",
        num: 'Id.',
        name: 'Name',
        value: 'Trigger conditional expression',
        validEdit: 'Validation modification',
        validEditMessage: 'This predicates is used in {{used}} rules. Really update predicate ?'
      },
      metadata: {
        title: 'Metadata',
        add: 'Create new metadata',
        edit: 'Modify metadata',
        details: 'Metadata details',
        detailsUser: 'User profile detail',
        id: 'ID',
        label: 'Name',
        type: 'Type',
        description: 'Description',
        invalid: 'Field is required',
        listLabel: 'Value name',
        addValue: 'Add new value',
        removeValue: 'Remove value',
        system: 'System metadata'
      },
      'metadata-rules': {
        title: 'Metadata Rules',
        label: 'Name',
        'is-same-name': 'The name of the rule is already taken for another rule, please use another one',
        'is-same-rules': 'The same rule has already been configured and saved, you can use it',
        'metadata-item': {
          name: 'Target metadata',
          description: 'Target metadata description',
          type: 'Metadata type target'
        },
        'metadata-user': {
          name: 'Source user profile',
          description: 'Description of source user profile',
          type: 'Type of source user profile'
        },
        edit: {
          title: 'Modify metadata rule'
        },
        add: {
          title: 'Create new metadata rule'
        }
      },
      dataset: {
        delete:
          'All versions and associated data will be deleted. Restitutions and presentations using this dataset will no longer display the corresponding data. Do you confirm the deletion?',
        title: 'Dataset',
        datasetDetails: 'Dataset details',
        details: 'Details',
        id: 'Id',
        name: 'Name',
        oClass: 'Business model',
        type: 'Type',
        'is-same-name': 'The name of the dataset is already taken, please use another one',
        add: {
          title: 'Create a new dataset'
        },
        edit: {
          title: 'Update dataset'
        },
        OPEN: 'Open',
        CLOSED: 'Closed',
        MODIFIABLE: 'Modifiable',
        conflict: 'Careful, the following dashboards are shared to groups which can no longer access this datasource:',
        entities: {
          dashboard: 'Dashboard'
        },
        addTag: 'Add a new tag'
      },
      'abac-rules': {
        delete: 'Delete',
        metadataUser: 'Users profile',
        title: {
          list: 'Abac Rules',
          add: 'Create new abac rule',
          view: "Abac rule's information",
          edit: 'Abac rule edition'
        },
        form: {
          id: 'ID',
          name: 'Name',
          description: 'Description',
          status: 'Status',
          statusActive: 'Active',
          statusInactive: 'Inactive',
          predicate: 'Predicate',
          type: 'Type',
          typeMetadata: 'Metadata',
          typeAttribute: 'Attribute',
          typeSelected: "You can't change type with current conditions",
          addMetadata: 'Add metadata condition',
          addAttribute: 'Add attribute condition',
          addGroup: 'Add group condition',
          cancel: 'CANCEL',
          validate: 'VALIDATE'
        }
      },
      user: {
        title: 'User profile',
        add: 'Create new user profile',
        label: 'Name',
        type: 'Type',
        invalid: 'Field is required',
        edit: 'Edit user profile'
      },
      environment: {
        list: 'Execution contexts',
        add: 'Create new execution context',
        edit: 'Edit execution context',
        info: "Execution context's information",
        formatInt: 'Value must be an integer',
        formatDouble: "Value must be an integer, separator must be '.'",
        formatName: 'The only special characters allowed are: [ - _ ] ',
        name: 'Name',
        type: 'Type',
        value: 'Variable value'
      },
      classes: {
        list: 'Classes',
        name: 'Name',
        title: 'Classe {{business model}}',
        image: 'Image',
        formatName: 'The only characters allowed are: [ lowercase, - _ ] ',
        model: 'Model',
        description: 'Description',
        lines: 'Lines',
        add: 'Create new business model',
        edit: 'Modify business model',
        rename: 'Rename business model',
        addAttr: 'Attribute',
        infoAttr: '{{business model}} business model > Attributes',
        info: 'business model information',
        rules: 'Symbol definition rules',
        condition: 'Used if condition verified',
        attrName: 'Attribute to check',
        value: 'Comparison value',
        operation: 'Comparison operation',
        operations: {
          EQUALS: 'is equal',
          GREATER: 'is greater',
          GREATER_OR_EQUAL: 'is greater or equal',
          LOWER: 'is lower',
          LOWER_OR_EQUAL: 'is lower or equal',
          CONTAINS: 'contains as text'
        },
        createClassModalMessage:
          'Creating a business model without attributes is impossible. Add an attribute before creating the business model, with "Add attribute" button.',
        createClassConfirmMessage: 'Confirm business model creation',
        deleteClassConfirmMessage: 'Confirm deleting the selected business model',
        linkedObjects: 'Linked objects',
        usedElsewhere: "Used by other users' objects",
        associations: 'Associations',
        type: 'Type',
        attributes: {
          add: 'business model Add attribute',
          edit: 'Edit attribute',
          name: 'Attribute label',
          technicalName: 'Technical name',
          info: 'Attribute information',
          description: 'Description',
          field: 'Field',
          dfield: 'Field',
          category: 'Category',
          multiValued: 'Multi valued'
        }
      },
      fields: {
        add: 'Add new field',
        info: 'Field information',
        list: 'Fields',
        edit: 'Edit field',
        name: 'Name',
        description: 'description',
        type: 'Technical type',
        attributes: 'Attribute presence',
        attributesTab: 'Attributes',
        attributeName: 'Attribute name',
        className: 'Class',
        confirmFieldDeletion: 'Confirm deleting the selected field',
        fieldType: {
          integer: 'Integer',
          long: 'Long number',
          decimal: 'Double number',
          string: 'Text',
          keyword: 'Keyword',
          instant: 'date',
          raw: 'Raw',
          Point: 'Point',
          MultiPoint: 'Multi-points',
          LineString: 'Line',
          MultiLineString: 'Multi-lines',
          Polygon: 'Polygon',
          MultiPolygon: 'Multi-polygons',
          information: {
            integer: 'Allows you to store integer numeric data less than 2^32',
            long: 'Allows you to store integer numeric data that can exceed 2^32',
            decimal: 'Allows you to store numeric data with decimal places',
            string:
              'Allows you to store data in alphanumeric format. This data is not indexed: it is possible to search on it but no aggregation',
            keyword:
              'Allows you to store data in alphanumeric format. This data is indexed: it is possible to search on it as well as aggregations.',
            instant: 'Allows you to store a date',
            raw: 'allows you to store image or file type data',
            Point: 'Allows you to store geographic coordinates of an object represented by a point (geo-json format)',
            MultiPoint:
              'Allows you to store geographic coordinates of an object composed of several unconnected points (geo-json format)',
            LineString:
              'Allows you to store geographic coordinates of an object represented as a line (geo-json format)',
            MultiLineString:
              'Allows you to store geographic coordinates of an object represented with several unconnected lines (longitude and latitude geo-json format)',
            Polygon:
              'Allows you to store geographic coordinates of an object represented by a polygon (geo-json format)',
            MultiPolygon:
              'Allows you to store geographic coordinates of an object represented by several polygons nested or not (geo-json format)'
          }
        },
        rawMethods: {
          http: 'From external url',
          upload: 'Upload from my computer'
        },
        formatOptions: {
          title: 'Formatting options',
          decimalPrecision: 'Decimal precision',
          noDecimalPrecision: 'No decimal precision provided',
          localeFormat: 'Localized format',
          unit: 'Unit',
          noUnit: 'No unit provided',
          dateFormat: 'Date format',
          noDateFormat: 'No date format provided',
          dateFormatOptions: {
            DATETIME: 'Date and time',
            DATE: 'Date',
            MONTH_YEAR: 'Month and year',
            DAY_MONTH: 'Day and month',
            YEAR: 'Year',
            MONTH: 'Month',
            DAY: 'Day'
          }
        }
      },
      userInfo: {
        list: 'Users',
        info: 'User information',
        profile: 'Profile',
        addMetadata: 'Add',
        editMetadata: 'Edit metadata',
        name: 'Given name',
        familyName: 'Family name',
        email: 'Email adress',
        metadata: 'Metadata',
        roles: ' Roles'
      },
      relationTypes: {
        list: 'Relations types',
        info: 'Relation type information',
        add: 'Add relation type',
        edit: 'Edit relation type',
        name: 'Name',
        nbRelation: 'Number of type relation',
        nbLink: 'Number of links that use this relation type',
        dateModification: 'Modification date',
        deletable: 'Can be deleted',
        deleteModalMessage: 'This relation type can be deleted because used.'
      },
      links: {
        list: 'Links between attributes',
        add: 'Create a link between attributes',
        classSource: 'Source business model',
        attributeSource: 'Source attribute',
        classDestination: 'Destination business model',
        attributeDestination: 'Destination attribute',
        relationType: 'Relation type',
        selectRelationType: 'Select relation type'
      },
      association: {
        ABAC: 'ABAC Rule',
        LINK: 'Relation',
        NAMED_QUERY: 'Named query',
        WIDGET: 'Widget',
        DATASET: 'Dataset',
        OCLASS: 'Data model',
        DASHBOARD: 'Dashboard',
        FIELD: 'Data type'
      },
      storage: {
        label: 'Base de stockage',
        description: {
          POSTGIS:
            'Recommended for storage of complex geographical data or for coordinate systems different from WGS 84. Recommended for storing classes with low estimated data volume.',
          ELASTIC:
            'Recommended in case of high data volume expected for the class. If you want to store geographical data in this class, simple forms have to be used and the reference coordinate system must be WGS 84. This storage system is horizontally scalable.'
        },
        options: {
          POSTGIS: 'PostGIS',
          ELASTIC: 'ElasticSearch'
        }
      },
      shared: {
        noCategories: 'No categories available',
        categoryModal: {
          dataset: {
            select: 'Select tag',
            searchOrCreate: 'Search for existing tag OR create a new one',
            name: 'Tag',
            selectIt: 'Select tag',
            create: 'Create tag',
            add: 'does not exist. <br>You can create it here. <br>It will be automatically selected and added to the tag list.'
          },
          attribute: {
            select: 'Select category',
            searchOrCreate: 'Search for existing category OR create a new one',
            name: 'Category',
            selectIt: 'Select category',
            create: 'Create category',
            add: 'does not exist. <br>You can create it here. <br>It will be automatically selected and added to the category list.'
          }
        }
      }
    },
    tooltip: {
      default: 'Default tooltip',
      attribute: 'Attributes tooltip',
      cluster: 'Cluster tooltip (graphs)',
      link: 'Link tooltip (graphs)',
      none: 'No tooltip'
    }
  }
};
