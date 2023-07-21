import { PryAccess, PryAccessModule } from '@provoly/dashboard';

const dashboardDashboard: PryAccessModule = {
  pages: {
    dashboard: {},
    manifest: {},
    toolbox: {},
    widget: {}
  }
};

const dashboardSupervision: PryAccessModule = {
  pages: {
    infrastructures: {
      roles: undefined,
      actions: {
        scale: []
      }
    },
    input_flows: {
      roles: undefined
    },
    business_datas: {
      roles: undefined
    }
  }
};

const dashboardAdmin: PryAccessModule = {
  pages: {
    abac_rules: {
      actions: {
        write: []
      }
    },
    environment: {
      actions: {
        write: []
      }
    },
    classes: {
      actions: {
        write: []
      }
    },
    links: {
      actions: {
        write: []
      }
    },
    metadata: {
      actions: {
        write: []
      }
    },
    metadata_rules: {
      actions: {
        write: []
      }
    },
    metadata_user: {
      actions: {
        write: []
      }
    },
    relation_types: {
      actions: {
        write: []
      }
    },
    user: {
      actions: {
        write: []
      }
    },
    fields: {
      actions: {
        write: []
      }
    },
    predicates: {
      actions: {
        write: []
      }
    }
  }
};
export const ACCESS: PryAccess = {
  modules: {
    supervision: dashboardSupervision,
    admin: dashboardAdmin,
    dashboard: dashboardDashboard
  }
};
