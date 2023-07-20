import { GeocodingService } from '@provoly/dashboard';
import { Control } from 'ol/control';
import { Options } from 'ol/control/Control';
import BaseEvent from 'ol/events/Event';
import { fromLonLat } from 'ol/proj';

export class AddressSearchedEvent extends BaseEvent {
  latLon: [number, number];
  coordinates: [number, number];
  address: string;
  query: string;

  // @ts-ignore
  constructor({ type, coordinates, address, latLon, query }) {
    super(type);
    this.coordinates = coordinates;
    this.address = address;
    this.latLon = latLon;
    this.query = query;
  }
}

export class SearchBarControl extends Control {
  button: HTMLButtonElement;
  input: HTMLInputElement;
  geocodingService?: GeocodingService;

  constructor(opt_options: Options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = '<div></div>';

    const element = document.createElement('div');
    element.className = 'ol-searchbar ol-unselectable ol-control';
    element.appendChild(button);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '1 rue de la Paix...';
    input.style.display = 'none';

    element.appendChild(input);

    super({
      element: element,
      target: options.target
    });

    this.button = button;
    button.addEventListener('click', this.toggleInputVisible.bind(this), false);
    this.input = input;
    input.addEventListener('keypress', this.keyPress.bind(this), false);
  }

  toggleInputVisible() {
    if (this.inputVisible) {
      this.input.style.display = 'none';
    } else {
      this.input.style.display = 'block';
    }
  }

  get inputVisible() {
    return this.input.style.display === 'block';
  }

  keyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.geocodingService?.fromAddress(this.input.value).subscribe((result) => {
        this.getMap()?.dispatchEvent(
          new AddressSearchedEvent({
            type: 'searched-address',
            latLon: result.latLon,
            coordinates: fromLonLat(result.latLon.reverse(), this.getMap()?.getView().getProjection()),
            query: this.input.value,
            address: result.pointAddress
          })
        );
        this.toggleInputVisible();
      });
    }
  }

  withGeocodingService(geocodingService: GeocodingService) {
    this.geocodingService = geocodingService;
    return this;
  }
}
