import { HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';

export const clone = jest.fn().mockImplementation((update: any) => ({} as unknown as HttpResponse<any[]>));

export const mockHttpResponse = {
  status: 200,
  type: HttpEventType.Response,
  headers: new HttpHeaders(),
  url: '',
  statusText: 'OK',
  ok: true,
  body: [] as any[],
  clone: clone()
} as HttpResponse<any[]>;

export const headers = {
  'Content-Type': 'application/json',
  'X-Total-Count': '400'
}
