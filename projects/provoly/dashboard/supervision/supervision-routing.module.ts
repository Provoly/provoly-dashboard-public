import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PRY_ACCESS_GUARD } from '@provoly/dashboard';
import { SupervisionBusinessDataComponent } from './components/supervision-business-data/supervision-business-data.component';
import { SupervisionFlowComponent } from './components/supervision-flow/supervision-flow.component';
import { SupervisionInfrastructuresComponent } from './components/supervision-infrastructures/supervision-infrastructures.component';
import { SupervisionIntegrationErrorsComponent } from './components/supervision-integration-errors/supervision-integration-errors.component';
import { SupervisionLayoutComponent } from './components/supervision-layout/supervision-layout.component';
import { PrySupervisionComponent } from './components/supervision.component';

const routes: Routes = [
  {
    path: '',
    component: SupervisionLayoutComponent,
    data: {
      access: {
        module: 'supervision'
      }
    },
    canActivate: [PRY_ACCESS_GUARD],
    children: [
      {
        path: 'infrastructures',
        component: SupervisionInfrastructuresComponent,
        data: {
          access: {
            module: 'supervision',
            page: 'infrastructures'
          }
        },
        canActivate: [PRY_ACCESS_GUARD]
      },
      {
        path: 'input-flows',
        component: SupervisionFlowComponent,
        data: {
          access: {
            module: 'supervision',
            page: 'input_flows'
          }
        },
        canActivate: [PRY_ACCESS_GUARD]
      },
      {
        path: 'business-datas',
        component: SupervisionBusinessDataComponent,
        data: {
          access: {
            module: 'supervision',
            page: 'business_datas'
          }
        },
        canActivate: [PRY_ACCESS_GUARD]
      },
      {
        path: 'integration-errors',
        component: SupervisionIntegrationErrorsComponent,
        data: {
          access: {
            module: 'supervision',
            page: 'integration_errors'
          }
        },
        canActivate: [PRY_ACCESS_GUARD]
      },
      {
        path: '',
        component: PrySupervisionComponent
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
export class SupervisionRoutingModule {}
