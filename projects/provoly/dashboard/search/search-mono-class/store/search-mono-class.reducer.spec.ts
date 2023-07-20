import { NormalizedCondition } from '@provoly/dashboard';
import { SearchMonoClassActions } from './search-mono-class.actions';
import { initialSearchMonoClassState, searchMonoClassReducer, SearchMonoClassState } from './search-mono-class.reducer';

describe('searchMonoClassReducer', () => {
  const initialState: SearchMonoClassState = Object.assign({}, initialSearchMonoClassState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = searchMonoClassReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('selectMonoClassSearch', () => {
    it('should change mono class id', () => {
      expect(
        searchMonoClassReducer(
          {
            ...initialState
          },
          SearchMonoClassActions.selectMonoClassSearch({ classId: 'class' })
        )
      ).toEqual({
        ...initialState,
        monoClassId: 'class'
      });
    });
  });
  describe('addFirstNormalizedCondition', () => {
    it('should add normalized condition', () => {
      expect(
        searchMonoClassReducer(
          {
            ...initialState
          },
          SearchMonoClassActions.addFirstNormalizedCondition({
            condition: {
              id: 'id'
            } as NormalizedCondition
          })
        )
      ).toEqual({
        ...initialState,
        monoClassConditions: {
          masterId: 'id',
          ids: ['id'],
          entities: {
            id: {
              id: 'id'
            } as NormalizedCondition
          }
        }
      });
    });
  });
  describe('addNormalizedConditionForConditionId', () => {
    it('should add normalized condition to existing', () => {
      expect(
        searchMonoClassReducer(
          {
            ...initialState,
            monoClassConditions: {
              masterId: 'id',
              ids: ['id'],
              entities: {
                id: {
                  id: 'id',
                  composed: ['id2']
                } as NormalizedCondition
              }
            }
          },
          SearchMonoClassActions.addNormalizedConditionForConditionId({
            condition: {
              id: 'id3'
            } as NormalizedCondition,
            conditionId: 'id'
          })
        )
      ).toEqual({
        ...initialState,
        monoClassConditions: {
          masterId: 'id',
          ids: ['id', 'id3'],
          entities: {
            id: {
              id: 'id',
              composed: ['id2', 'id3']
            } as NormalizedCondition,
            id3: {
              id: 'id3'
            } as NormalizedCondition
          }
        }
      });
    });
  });
  describe('updateNormalizedConditionOperatorForConditionId', () => {
    it('should update operator for condition id', () => {
      expect(
        searchMonoClassReducer(
          {
            ...initialState,
            monoClassConditions: {
              masterId: 'id',
              ids: ['id'],
              entities: {
                id: {
                  id: 'id',
                  operator: 'CONTAINS'
                } as NormalizedCondition
              }
            }
          },
          SearchMonoClassActions.updateNormalizedConditionOperatorForConditionId({
            conditionId: 'id',
            operator: 'EQUALS'
          })
        )
      ).toEqual({
        ...initialState,
        monoClassConditions: {
          masterId: 'id',
          ids: ['id'],
          entities: {
            id: {
              id: 'id',
              operator: 'EQUALS'
            } as NormalizedCondition
          }
        }
      });
    });
  });
  describe('updateNormalizedConditionValueForConditionId', () => {
    it('should update value for condition id', () => {
      expect(
        searchMonoClassReducer(
          {
            ...initialState,
            monoClassConditions: {
              masterId: 'id',
              ids: ['id'],
              entities: {
                id: {
                  id: 'id',
                  value: 'value'
                } as NormalizedCondition
              }
            }
          },
          SearchMonoClassActions.updateNormalizedConditionValueForConditionId({
            conditionId: 'id',
            value: 'value2'
          })
        )
      ).toEqual({
        ...initialState,
        monoClassConditions: {
          masterId: 'id',
          ids: ['id'],
          entities: {
            id: {
              id: 'id',
              value: 'value2'
            } as NormalizedCondition
          }
        }
      });
    });
  });
  describe('updateNormalizedConditionTypeForConditionId', () => {
    it('should update type for condition id', () => {
      expect(
        searchMonoClassReducer(
          {
            ...initialState,
            monoClassConditions: {
              masterId: 'id',
              ids: ['id'],
              entities: {
                id: {
                  id: 'id',
                  type: 'AND'
                } as NormalizedCondition
              }
            }
          },
          SearchMonoClassActions.updateNormalizedConditionTypeForConditionId({
            conditionId: 'id',
            conditionType: 'OR'
          })
        )
      ).toEqual({
        ...initialState,
        monoClassConditions: {
          masterId: 'id',
          ids: ['id'],
          entities: {
            id: {
              id: 'id',
              type: 'OR'
            } as NormalizedCondition
          }
        }
      });
    });
  });
  describe('deleteNormalizedCondition', () => {
    it('should delete normalized condition', () => {
      expect(
        searchMonoClassReducer(
          {
            ...initialState,
            monoClassConditions: {
              masterId: 'id',
              ids: ['id'],
              entities: {
                id: {
                  id: 'id',
                  type: 'AND'
                } as NormalizedCondition
              }
            }
          },
          SearchMonoClassActions.deleteNormalizedCondition({
            condition: { id: 'id' } as NormalizedCondition
          })
        )
      ).toEqual({
        ...initialState,
        monoClassConditions: {
          masterId: 'id',
          ids: [],
          entities: {}
        }
      });
    });
  });
  describe('removeConditionFromComposed', () => {
    it('should remove normalized condition from composed', () => {
      expect(
        searchMonoClassReducer(
          {
            ...initialState,
            monoClassConditions: {
              masterId: 'id',
              ids: ['id'],
              entities: {
                id: {
                  id: 'id',
                  composed: ['id2', 'id3']
                } as NormalizedCondition
              }
            }
          },
          SearchMonoClassActions.removeConditionFromComposed({
            parentId: 'id',
            childrenId: 'id2'
          })
        )
      ).toEqual({
        ...initialState,
        monoClassConditions: {
          masterId: 'id',
          ids: ['id'],
          entities: {
            id: {
              id: 'id',
              composed: ['id3']
            } as NormalizedCondition
          }
        }
      });
    });
  });
  describe('resetSearch', () => {
    it('should reset mono class search', () => {
      expect(
        searchMonoClassReducer(
          {
            ...initialState,
            monoClassId: 'id',
            monoClassConditions: {
              masterId: 'id',
              entities: {},
              ids: []
            }
          },
          SearchMonoClassActions.resetSearch()
        )
      ).toEqual({
        ...initialState
      });
    });
  });
  describe('addIdCondition', () => {
    it('should change mono class ids', () => {
      expect(
        searchMonoClassReducer(
          {
            ...initialState
          },
          SearchMonoClassActions.addIdCondition({ ids: ['ids'] })
        )
      ).toEqual({
        ...initialState,
        monoClassConditions: {
          masterId: null,
          entities: {},
          ids: ['ids']
        }
      });
    });
  });
  describe('addIdMaster', () => {
    it('should change mono class master id', () => {
      expect(
        searchMonoClassReducer(
          {
            ...initialState
          },
          SearchMonoClassActions.addIdMaster({ id: 'id' })
        )
      ).toEqual({
        ...initialState,
        monoClassConditions: {
          masterId: 'id',
          entities: {},
          ids: []
        }
      });
    });
  });
  describe('addEntities', () => {
    it('should change mono class entities', () => {
      expect(
        searchMonoClassReducer(
          {
            ...initialState
          },
          SearchMonoClassActions.addEntities({
            entities: {
              id: { id: 'id' } as NormalizedCondition
            }
          })
        )
      ).toEqual({
        ...initialState,
        monoClassConditions: {
          masterId: null,
          entities: {
            id: { id: 'id' } as NormalizedCondition
          },
          ids: []
        }
      });
    });
  });
  describe('addIdClass', () => {
    it('should change mono class id', () => {
      expect(
        searchMonoClassReducer(
          {
            ...initialState
          },
          SearchMonoClassActions.addIdClass({
            id: 'id'
          })
        )
      ).toEqual({
        ...initialState,
        monoClassId: 'id'
      });
    });
  });
});
