import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PRY_ACCESS_GUARD } from '@provoly/dashboard';
import { PryImportComponent } from './components/import.component';

const routes: Routes = [
  {
    path: '',
    component: PryImportComponent,
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
