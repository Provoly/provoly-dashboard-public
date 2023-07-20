import { BaseToolboxAction } from '@provoly/dashboard';
import { Infrastructure, InputFlow, IntegrationError } from './supervision-api.model';
import { SupervisionActions } from './supervision.actions';
import { initialSupervisionState, supervisionReducer, SupervisionState } from './supervision.reducer';

describe('Supervision Reducer', () => {
  const initialState: SupervisionState = Object.assign({}, initialSupervisionState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = supervisionReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('selectMenu', () => {
    it('should be able to set selected menu supervision', () => {
      expect(
        supervisionReducer(
          {
            ...initialState,
            highlightedMenu: 'a'
          },
          SupervisionActions.highLightMenu({ menu: 'b' })
        )
      ).toEqual({
        ...initialState,
        highlightedMenu: 'b'
      });
    });
  });

  describe('toggleMenu', () => {
    it('should be able to change toggle menu value', () => {
      expect(
        supervisionReducer(
          {
            ...initialState,
            menuOpen: true
          },
          SupervisionActions.toggleMenu()
        )
      ).toEqual({
        ...initialState,
        menuOpen: false
      });
    });
  });
  describe('resetActions', () => {
    it('should be able to reset actions', () => {
      const action: BaseToolboxAction = {
        action: SupervisionActions.loadFlows(),
        label: 'label',
        icon: 'icon'
      };
      expect(
        supervisionReducer(
          {
            ...initialState,
            actions: [action],
            subActions: [action]
          },
          SupervisionActions.resetActions()
        )
      ).toEqual({
        ...initialState,
        actions: [],
        subActions: []
      });
    });
  });
  describe('mainActions', () => {
    it('should be able to change main actions', () => {
      const action: BaseToolboxAction = {
        action: SupervisionActions.loadFlows(),
        label: 'label',
        icon: 'icon'
      };
      expect(
        supervisionReducer(
          {
            ...initialState
          },
          SupervisionActions.mainActions({ actions: [action, { ...action, label: 'label2' }] })
        )
      ).toEqual({
        ...initialState,
        actions: [action, { ...action, label: 'label2' }]
      });
    });
  });
  describe('subActions', () => {
    it('should be able to change sub actions', () => {
      const action: BaseToolboxAction = {
        action: SupervisionActions.loadFlows(),
        label: 'label',
        icon: 'icon'
      };
      expect(
        supervisionReducer(
          {
            ...initialState
          },
          SupervisionActions.subActions({ actions: [action, { ...action, label: 'label2' }] })
        )
      ).toEqual({
        ...initialState,
        subActions: [action, { ...action, label: 'label2' }]
      });
    });
  });

  describe('loadInfras', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState
          },
          SupervisionActions.loadInfras()
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('loadInfrasSuccess', () => {
    it('should set two infras', () => {
      const infra: Infrastructure = {
        available: 1,
        hotScale: true,
        maxReplicas: 1,
        minReplicas: 1,
        missing: true,
        name: 'name',
        replicas: 1,
        title: 'title'
      };
      expect(
        supervisionReducer(
          {
            ...initialState
          },
          SupervisionActions.loadInfrasSuccess({ infras: [infra, { ...infra, name: 'name2' }] })
        )
      ).toEqual({
        ...initialState,
        infrastructures: [infra, { ...infra, name: 'name2' }]
      });
    });
  });
  describe('loadInfrasFailure', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState,
            loading: true
          },
          SupervisionActions.loadInfrasFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });
  describe('scaleInfra', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState
          },
          SupervisionActions.scaleInfra({ name: 'name', scale: 1, up: true })
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('scaleInfraSuccess', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState
          },
          SupervisionActions.scaleInfraSuccess({ name: 'name', time: 'time', up: true })
        )
      ).toEqual({
        ...initialState,
        lastInfraScale: { name: 'name', time: 'time', up: true }
      });
    });
  });
  describe('scaleInfraFailure', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState,
            loading: true
          },
          SupervisionActions.scaleInfraFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });
  describe('loadFlows', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState
          },
          SupervisionActions.loadFlows()
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('loadFlowsSuccess', () => {
    it('should set two infras', () => {
      const flow: InputFlow = {
        name: 'name',
        dateIntegration: 'date',
        format: 'format',
        idFlow: 'id',
        accessLink: 'link',
        nbIntegrationKo: 1,
        nbIntegrationOk: 1,
        status: true,
        startProcessorLink: 'link',
        stopProcessorLink: 'link'
      };
      expect(
        supervisionReducer(
          {
            ...initialState
          },
          SupervisionActions.loadFlowsSuccess({
            flows: [flow, { ...flow, name: 'name2' }]
          })
        )
      ).toEqual({
        ...initialState,
        inputFlows: [flow, { ...flow, name: 'name2' }]
      });
    });
  });
  describe('loadFlowsFailure', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState,
            loading: true
          },
          SupervisionActions.loadFlowsFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });
  describe('loadIntegrationErrors', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState
          },
          SupervisionActions.loadIntegrationErrors()
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('loadIntegrationErrorsSuccess', () => {
    it('should set an array of errors', () => {
      const e: IntegrationError = {
        oClass: '123',
        errors: [
          {
            label: 'bad error',
            count: 51
          }
        ]
      };
      expect(
        supervisionReducer(
          {
            ...initialState,
            loading: true
          },
          SupervisionActions.loadIntegrationErrorsSuccess({
            integrationErrors: [e]
          })
        )
      ).toEqual({
        ...initialState,
        loading: false,
        integrationErrors: [e]
      });
    });
  });
  describe('loadIntegrationErrorsFailure', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState,
            loading: true
          },
          SupervisionActions.loadIntegrationErrorsFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });
  describe('toggleErrorDetails', () => {
    it('should toggle error to show and details open boolean', () => {
      expect(
        supervisionReducer(
          {
            ...initialState,
            currentIntegrationError: undefined,
            errorDetailsOpen: false
          },
          SupervisionActions.toggleErrorDetails({
            error: {
              oClass: '123',
              errors: [
                {
                  label: 'bad error',
                  count: 51
                }
              ]
            },
            errorDetailsOpen: true
          })
        )
      ).toEqual({
        ...initialState,
        currentIntegrationError: {
          oClass: '123',
          errors: [
            {
              label: 'bad error',
              count: 51
            }
          ]
        },
        errorDetailsOpen: true
      });
    });
  });
  describe('toggleClassSelection', () => {
    it('should add a class if it is not in the list of selected classes', () => {
      expect(
        supervisionReducer(
          {
            ...initialState,
            selectedClasses: ['oclass1', 'oclass2', 'oclass3']
          },
          SupervisionActions.toggleClassSelection({ selectedClass: 'oclass4' })
        )
      ).toEqual({
        ...initialState,
        selectedClasses: ['oclass1', 'oclass2', 'oclass3', 'oclass4']
      });
    });
    it('should remove a class if it is already in the list of selected classes', () => {
      expect(
        supervisionReducer(
          {
            ...initialState,
            selectedClasses: ['oclass1', 'oclass2', 'oclass3']
          },
          SupervisionActions.toggleClassSelection({ selectedClass: 'oclass2' })
        )
      ).toEqual({
        ...initialState,
        selectedClasses: ['oclass1', 'oclass3']
      });
    });
  });
  describe('reloadErrors', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState
          },
          SupervisionActions.reloadErrors()
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('reloadErrorsSuccess', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState,
            loading: true
          },
          SupervisionActions.reloadErrorsSuccess()
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });
  describe('reloadErrorsFailure', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState,
            loading: true
          },
          SupervisionActions.reloadErrorsFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });
  describe('acknowledgeErrors', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState
          },
          SupervisionActions.acknowledgeErrors()
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('acknowledgeErrorsSuccess', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState,
            loading: true
          },
          SupervisionActions.acknowledgeErrorsSuccess()
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });
  describe('acknowledgeErrorsFailure', () => {
    it('should change loading', () => {
      expect(
        supervisionReducer(
          {
            ...initialState,
            loading: true
          },
          SupervisionActions.acknowledgeErrorsFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });
  describe('setRefreshInterval', () => {
    it('should change the refresh interval value for inntegration errors', () => {
      expect(
        supervisionReducer(
          {
            ...initialState
          },
          SupervisionActions.setRefreshInterval({ interval: 5000 })
        )
      ).toEqual({
        ...initialState,
        refreshInterval: 5000
      });
    });
  });
});
