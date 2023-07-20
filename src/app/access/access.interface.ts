import {
  PryAccess,
  PryAccessModuleAdmin,
  PryAccessModuleDashboard,
  PryAccessModuleSupervision
} from '@provoly/dashboard';

const dashboardDashboard: PryAccessModuleDashboard = {
  pages: {
    dashboard: {},
    manifest: {},
    toolbox: {},
    widget: {}
  }
};

const dashboardSupervision: PryAccessModuleSupervision = {
  pages: {
    infrastructures: {
      roles: undefined,
      actions: {
        scale: undefined
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

const dashboardAdmin: PryAccessModuleAdmin = {
  pages: {
    abac_rules: {
      actions: {
        write: undefined
      }
    },
    environment: {
      actions: {
        write: undefined
      }
    },
    classes: {
      actions: {
        write: undefined
      }
    },
    links: {
      actions: {
        write: undefined
      }
    },
    metadata: {
      actions: {
        write: undefined
      }
    },
    metadata_rules: {
      actions: {
        write: undefined
      }
    },
    metadata_user: {
      actions: {
        write: undefined
      }
    },
    relation_types: {
      actions: {
        write: undefined
      }
    },
    user: {
      actions: {
        write: undefined
      }
    },
    fields: {
      actions: {
        write: undefined
      }
    },
    predicates: {
      actions: {
        write: undefined
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
