import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';
import { BusyService } from '../_services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busyService: BusyService) {}
  // after the request is sent, we want to show the spinner
  // and after add interceptor we need to add it to app.module.ts
  // intercept is a method that takes a request and a next argument
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // show the spinner
    this.busyService.busy();
    return next.handle(request).pipe(
      // hide the spinner
      delay(1000),
      finalize(() => {
        this.busyService.idle();
      })
    )
      
  }
}
