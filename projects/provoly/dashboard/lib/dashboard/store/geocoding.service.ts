import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable } from 'rxjs';
import { ConfigSelectors } from '../../core/store/config/config.selectors';

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  label: string;
  score: number;
  housenumber: string;
  id: string;
  type: string;
  name: string;
  postcode: string;
  citycode: string;
  x: number;
  y: number;
  city: string;
  context: string;
  importance: number;
  street: string;
}

export interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

export interface GouvResponse {
  type: string;
  version: string;
  features: Feature[];
  attribution: string;
  licence: string;
  query: string;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  constructor(
    private httpClient: HttpClient,
    private store: Store
  ) {}

  fromAddress(address: string): Observable<{ latLon: number[]; pointAddress: string }> {
    const preparedAddress = address.replace(/\s/g, '+');
    return this.store.select(ConfigSelectors.geocodingUrl).pipe(
      mergeMap((url) =>
        this.httpClient.get<GouvResponse>(`${url}/search/?text=${preparedAddress}`).pipe(
          map((result) => ({
            latLon: result.features[0].geometry.coordinates.reverse(),
            pointAddress: result.features[0].properties.label
          }))
        )
      )
    );
  }

  fromLatLong(latLng: number[]): Observable<{ latLon: number[]; pointAddress: string }> {
    return this.store.select(ConfigSelectors.geocodingUrl).pipe(
      mergeMap((url) =>
        this.httpClient
          .get<GouvResponse>(`${url}/reverse/`, {
            params: {
              lat: latLng[0],
              lon: latLng[1]
            }
          })
          .pipe(
            map((result) => ({
              latLon: result.features[0].geometry.coordinates.reverse(),
              pointAddress: result.features[0].properties.label
            }))
          )
      )
    );
  }

  getWmsFeatures(url: string): Observable<{ features: any[] }> {
    return this.httpClient.get(url).pipe(map((json: any) => json));
  }
}
