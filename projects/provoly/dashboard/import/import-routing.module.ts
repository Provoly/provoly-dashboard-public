import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PRY_ACCESS_GUARD } from '@provoly/dashboard';
import { PryImportFormComponent } from './components/form/import-form.component';

const routes: Routes = [
  {
    path: '',
    component: PryImportFormComponent,
    data: {
      access: {
        module: 'dashboard',
        page: 'import'
      }
    },
    canActivate: [PRY_ACCESS_GUARD]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PryImportRoutingModule {}
