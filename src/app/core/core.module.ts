/* eslint-disable import/order */
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

// Client
import { laravelHttpClientCacheInterceptorService } from './client/laravel/laravel-http-client-cache-interceptor.service';
import { laravelHttpClientErrorHandlerService } from './client/laravel/laravel-http-client-error-handler.service';
import { laravelHttpClientInterceptorService } from './client/laravel/laravel-http-client-interceptor.service';
import { laravelHttpClientMockApiInterceptorService } from './client/laravel/laravel-http-client-mock-api-interceptor.service';
import { laravelHttpClientService } from './client/laravel/laravel-http-client.service';

import { coreInitializer } from './core.init';

// Auth
import {
  OktaAuthModule,
  OktaConfig,
} from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import oktaConfig from './core.config';
import { AuthService } from '@dxp-web/cx/identity/auth';

// Guard
import * as fromGuard from './guard';

// Command
import * as fromCommandBusServices from './command/bus';
import * as fromCommandBusMiddleWares from './command/bus/middleware';
import * as fromCommandBusHandlers from './command/handler';

// Finder
import * as fromFinders from './finder';

// Services
import * as fromServices from './services';

const oktaAuth = new OktaAuth(oktaConfig.oidc);
const moduleConfig: OktaConfig = { oktaAuth };

@NgModule({
  imports: [
    OktaAuthModule.forRoot(moduleConfig),
    CommonModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [
    {
      provide: Window,
      useValue: window,
    },
    { provide: APP_INITIALIZER, useFactory: coreInitializer, deps: [AuthService, fromServices.UserStateService], multi: true },

    // Auth
    AuthService,

    // Client
    laravelHttpClientService,
    laravelHttpClientErrorHandlerService,

    // Client Http Interceptor
    { provide: HTTP_INTERCEPTORS, useClass: laravelHttpClientInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: laravelHttpClientMockApiInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: laravelHttpClientCacheInterceptorService, multi: true },

    // Cookie
    CookieService,

    // Guard
    ...fromGuard.guardServices,

    // Command Bus, Event Bus
    ...fromCommandBusServices.commandBusServices,

    // Command Bus Middleware
    { provide: fromCommandBusMiddleWares.COMMAND_BUS_MIDDLEWARES, useClass: fromCommandBusMiddleWares.EventMiddlewareService, multi: true },

    // Command Handler
    ...fromCommandBusHandlers.handlers,

    // Finder
    ...fromFinders.finders,

    // Services
    ...fromServices.services,
  ],
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [],
    };
  }

}
