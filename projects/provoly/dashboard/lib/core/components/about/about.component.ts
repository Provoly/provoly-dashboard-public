import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PryI18nService } from '../../i18n/i18n.service';
import { ConfigActions } from '../../store/config/config.actions';
import { ConfigSelectors } from '../../store/config/config.selectors';
import { BackendVersion, FrontendVersion, Versions } from '../../store/config/versions.interface';

@Component({
  selector: 'pry-about',
  templateUrl: 'about.component.html'
})
export class PryAboutComponent {
  version$: Observable<Versions | null>;

  constructor(private store: Store, private i18nService: PryI18nService) {
    this.store.dispatch(ConfigActions.loadVersions());
    this.version$ = this.store.select(ConfigSelectors.selectVersions);
  }

  displayVersion(value: BackendVersion | FrontendVersion) {
    const backVersion = value as BackendVersion;
    if (!!backVersion.chartVersion) {
      return `${backVersion.chartVersion}[${backVersion.applicationVersion}]`;
    }
    const frontVersion = value as FrontendVersion;
    if (!!frontVersion.libVersion) {
      return frontVersion.libVersion;
    }
    return this.i18nService.instant('@pry.about.noVersion');
  }

  hasVersion(value: BackendVersion | FrontendVersion) {
    const backVersion = value as BackendVersion;
    const frontVersion = value as FrontendVersion;
    return !!value && (!!backVersion.chartVersion || !!frontVersion.libVersion);
  }
}
