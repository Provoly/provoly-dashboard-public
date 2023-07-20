import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PRY_ACCESS_GUARD } from '@provoly/dashboard';
import { AdminAbacRulesEditComponent } from './components/admin-abac-rules/admin-abac-rules-edit/admin-abac-rules-edit.component';
import { AdminAbacRulesNewComponent } from './components/admin-abac-rules/admin-abac-rules-new/admin-abac-rules-new.component';
import { AdminAbacRulesViewComponent } from './components/admin-abac-rules/admin-abac-rules-view/admin-abac-rules-view.component';
import { AdminAbacRulesComponent } from './components/admin-abac-rules/admin-abac-rules.component';
import { AdminClassesCustomizeComponent } from './components/admin-classes/admin-classes-customize/admin-classes-customize.component';
import { AdminClassesEditComponent } from './components/admin-classes/admin-classes-edit/admin-classes-edit.component';
import { AdminClassesNewComponent } from './components/admin-classes/admin-classes-new/admin-classes-new.component';
import { AdminAttributesEditComponent } from './components/admin-classes/admin-classes-view/admin-attributes-edit/admin-attributes-edit.component';
import { AdminAttributesNewComponent } from './components/admin-classes/admin-classes-view/admin-attributes-new/admin-attributes-new.component';
import { AdminClassesViewComponent } from './components/admin-classes/admin-classes-view/admin-classes-view.component';
import { AdminClassesComponent } from './components/admin-classes/admin-classes.component';
import { AdminDatasetComponent } from './components/admin-dataset/admin-dataset.component';
import { AdminEditDatasetComponent } from './components/admin-dataset/admin-edit-dataset/admin-edit-dataset.component';
import { AdminNewDatasetComponent } from './components/admin-dataset/admin-new-dataset/admin-new-dataset.component';
import { AdminEnvironmentNewComponent } from './components/admin-environment/admin-environment-new/admin-environment-new.component';
import { AdminEnvironmentUpdateComponent } from './components/admin-environment/admin-environment-update/admin-environment-update.component';
import { AdminEnvironmentComponent } from './components/admin-environment/admin-environment.component';
import { AdminFieldsEditComponent } from './components/admin-fields/admin-fields-edit/admin-fields-edit.component';
import { AdminFieldsNewComponent } from './components/admin-fields/admin-fields-new/admin-fields-new.component';
import { AdminFieldsComponent } from './components/admin-fields/admin-fields.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminLinksNewComponent } from './components/admin-links/admin-links-new/admin-links-new.component';
import { AdminLinksComponent } from './components/admin-links/admin-links.component';
import { AdminEditMetadataRulesComponent } from './components/admin-metadata-rules/admin-edit-metadata-rules/admin-edit-metadata-rules.component';
import { AdminMetadataRulesComponent } from './components/admin-metadata-rules/admin-metadata-rules.component';
import { AdminNewMetadataRulesComponent } from './components/admin-metadata-rules/admin-new-metadata-rules/admin-new-metadata-rules.component';
import { AdminMetadataUserComponent } from './components/admin-metadata-user/admin-metadata-user.component';
import { AdminUserEditMetadataComponent } from './components/admin-metadata-user/admin-user-edit-metadata/admin-user-edit-metadata.component';
import { AdminUserNewMetadataComponent } from './components/admin-metadata-user/admin-user-new-metadata/admin-user-new-metadata.component';
import { AdminEditMetadataComponent } from './components/admin-metadata/admin-edit-metadata/admin-edit-metadata.component';
import { AdminMetadataComponent } from './components/admin-metadata/admin-metadata.component';
import { AdminNewMetadataComponent } from './components/admin-metadata/admin-new-metadata/admin-new-metadata.component';
import { AdminPredicatesNewComponent } from './components/admin-predicates/admin-predicates-new/admin-predicates-new.component';
import { AdminPredicatesUpdateComponent } from './components/admin-predicates/admin-predicates-update/admin-predicates-update.component';
import { AdminPredicatesComponent } from './components/admin-predicates/admin-predicates.component';
import { AdminRelationTypesComponent } from './components/admin-relation-types/admin-relation-types.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { PryAdminComponent } from './components/admin.component';

export const routes: Routes = [
  {
    path: '',
    data: {
      access: {
        module: 'admin'
      }
    },
    canActivate: [PRY_ACCESS_GUARD],
    component: AdminLayoutComponent,
    children: [
      {
        path: 'environment',
        children: [
          {
            path: '',
            component: AdminEnvironmentComponent,
            data: {
              access: {
                module: 'admin',
                page: 'environment'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'new',
            component: AdminEnvironmentNewComponent,
            data: {
              access: {
                module: 'admin',
                page: 'environment',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'edit/:name',
            component: AdminEnvironmentUpdateComponent,
            data: {
              access: {
                module: 'admin',
                page: 'environment',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          }
        ]
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            component: AdminUserComponent,
            data: {
              access: {
                module: 'admin',
                page: 'user'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          }
        ]
      },
      {
        path: 'classes',
        children: [
          {
            path: '',
            component: AdminClassesComponent,
            data: {
              access: {
                module: 'admin',
                page: 'classes'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'new',
            component: AdminClassesNewComponent,
            data: {
              access: {
                module: 'admin',
                page: 'classes',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: ':id',
            children: [
              {
                path: '',
                component: AdminClassesViewComponent,
                data: {
                  access: {
                    module: 'admin',
                    page: 'classes'
                  }
                },
                canActivate: [PRY_ACCESS_GUARD]
              },
              {
                path: 'new',
                component: AdminAttributesNewComponent,
                data: {
                  access: {
                    module: 'admin',
                    page: 'classes',
                    action: 'write'
                  }
                },
                canActivate: [PRY_ACCESS_GUARD]
              },
              {
                path: 'edit',
                component: AdminClassesEditComponent,
                data: {
                  access: {
                    module: 'admin',
                    page: 'classes',
                    action: 'write'
                  }
                },
                canActivate: [PRY_ACCESS_GUARD]
              },
              {
                path: 'customize',
                component: AdminClassesCustomizeComponent,
                data: {
                  access: {
                    module: 'admin',
                    page: 'classes',
                    action: 'write'
                  }
                },
                canActivate: [PRY_ACCESS_GUARD]
              },
              {
                path: ':attrId/edit',
                component: AdminAttributesEditComponent,
                data: {
                  access: {
                    module: 'admin',
                    page: 'classes',
                    action: 'write'
                  }
                },
                canActivate: [PRY_ACCESS_GUARD]
              }
            ]
          }
        ]
      },
      {
        path: 'predicates',
        children: [
          {
            path: '',
            component: AdminPredicatesComponent,
            data: {
              access: {
                module: 'admin',
                page: 'predicates'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'new',
            component: AdminPredicatesNewComponent,
            data: {
              access: {
                module: 'admin',
                page: 'predicates',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'edit/:id',
            component: AdminPredicatesUpdateComponent,
            data: {
              access: {
                module: 'admin',
                page: 'predicates',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          }
        ]
      },
      {
        path: 'fields',
        children: [
          {
            path: '',
            component: AdminFieldsComponent,
            data: {
              access: {
                module: 'admin',
                page: 'fields'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'new',
            component: AdminFieldsNewComponent,
            data: {
              access: {
                module: 'admin',
                page: 'fields',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'edit/:id',
            component: AdminFieldsEditComponent,
            data: {
              access: {
                module: 'admin',
                page: 'fields',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          }
        ]
      },
      {
        path: 'abac-rules',
        children: [
          {
            path: '',
            component: AdminAbacRulesComponent,
            data: {
              access: {
                module: 'admin',
                page: 'abac_rules'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'new',
            component: AdminAbacRulesNewComponent,
            data: {
              access: {
                module: 'admin',
                page: 'abac_rules',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: ':id',
            component: AdminAbacRulesViewComponent,
            data: {
              access: {
                module: 'admin',
                page: 'abac_rules'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: ':id/edit',
            component: AdminAbacRulesEditComponent,
            data: {
              access: {
                module: 'admin',
                page: 'abac_rules',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          }
        ]
      },
      {
        path: 'metadata',
        children: [
          {
            path: '',
            component: AdminMetadataComponent,
            data: {
              access: {
                module: 'admin',
                page: 'metadata'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'new',
            component: AdminNewMetadataComponent,
            data: {
              access: {
                module: 'admin',
                page: 'metadata',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'edit/:uuid',
            component: AdminEditMetadataComponent,
            data: {
              access: {
                module: 'admin',
                page: 'metadata',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          }
        ]
      },
      {
        path: 'metadata-user',
        children: [
          {
            path: '',
            component: AdminMetadataUserComponent,
            data: {
              access: {
                module: 'admin',
                page: 'metadata_user'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'new',
            component: AdminUserNewMetadataComponent,
            data: {
              access: {
                module: 'admin',
                page: 'metadata_user',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'edit/:uuid',
            component: AdminUserEditMetadataComponent,
            data: {
              access: {
                module: 'admin',
                page: 'metadata_user',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          }
        ]
      },
      {
        path: 'metadata-rules',
        children: [
          {
            path: '',
            component: AdminMetadataRulesComponent,
            data: {
              access: {
                module: 'admin',
                page: 'metadata_rules'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'new',
            component: AdminNewMetadataRulesComponent,
            data: {
              access: {
                module: 'admin',
                page: 'metadata_rules',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'edit/:uuid',
            component: AdminEditMetadataRulesComponent,
            data: {
              access: {
                module: 'admin',
                page: 'metadata_rules',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          }
        ]
      },
      {
        path: 'dataset',
        children: [
          {
            path: '',
            component: AdminDatasetComponent,
            data: {
              access: {
                module: 'admin',
                page: 'dataset'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'new',
            component: AdminNewDatasetComponent,
            data: {
              access: {
                module: 'admin',
                page: 'dataset',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'edit/:uuid',
            component: AdminEditDatasetComponent,
            data: {
              access: {
                module: 'admin',
                page: 'dataset',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          }
        ]
      },
      {
        path: 'relation-types',
        children: [
          {
            path: '',
            component: AdminRelationTypesComponent,
            data: {
              access: {
                module: 'admin',
                page: 'relation_types'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          }
        ]
      },
      {
        path: 'links',
        children: [
          {
            path: '',
            component: AdminLinksComponent,
            data: {
              access: {
                module: 'admin',
                page: 'links'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          },
          {
            path: 'new',
            component: AdminLinksNewComponent,
            data: {
              access: {
                module: 'admin',
                page: 'links',
                action: 'write'
              }
            },
            canActivate: [PRY_ACCESS_GUARD]
          }
        ]
      },
      {
        path: '',
        component: PryAdminComponent
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
