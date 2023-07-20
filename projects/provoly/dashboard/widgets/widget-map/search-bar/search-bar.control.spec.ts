import { GeocodingService } from '@provoly/dashboard';
import { Map } from 'ol';
import { of } from 'rxjs';
import { SearchBarControl } from './search-bar.control';

describe('SearchBar Control plugin', () => {
  let control: SearchBarControl;

  beforeEach(() => {
    control = new SearchBarControl({});
  });

  it('should allow toggling opened/closed search bar', () => {
    expect(control.inputVisible).toBeFalsy();
    control.toggleInputVisible();
    expect(control.inputVisible).toBeTruthy();
  });

  it('should allow searching for address', () => {
    jest.useFakeTimers();
    const geocodingService = {
      fromAddress: (address: string) => of({ latLon: [2, 4], pointAddress: '2 rue Marc Sangnier Bègles' })
    } as GeocodingService;
    const fromAddressSpy = jest.spyOn(geocodingService, 'fromAddress');
    const map = {
      dispatchEvent: () => undefined,
      getView: () => ({
        getProjection: () => undefined
      })
    } as unknown as Map;
    const getMapSpy = jest.spyOn(control, 'getMap').mockReturnValue(map);
    const getDispatchMapSpy = jest.spyOn(map, 'dispatchEvent');
    control.toggleInputVisible();
    control.withGeocodingService(geocodingService);
    control.input.value = '2 rue marc sangnier Bègles';
    control.keyPress({ key: 'Enter' } as KeyboardEvent);

    jest.runAllTimers();
    expect(fromAddressSpy).toHaveBeenCalledWith('2 rue marc sangnier Bègles');
    expect(getDispatchMapSpy).toHaveBeenCalledWith({
      address: '2 rue Marc Sangnier Bègles',
      coordinates: [445277.9631730943, 222684.20850554318],
      latLon: [4, 2],
      query: '2 rue marc sangnier Bègles',
      target: null,
      type: 'searched-address'
    });
    expect(control.inputVisible).toBeFalsy();
  });
});
