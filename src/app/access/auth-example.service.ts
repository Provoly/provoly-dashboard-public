import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthExampleService {
  getRoles(): string[] {
    return ['pry-admin'];
  }
}
