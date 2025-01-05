import { Injectable } from '@angular/core';
import { laravelHttpClientService } from '../../client/laravel';
import { RemoveTokenCommand } from '../remove-token-command';
import { laravelHttpResponseInterface } from './handler.interface';

@Injectable()
export class RemoveTokenHandler {

  constructor(
    private laravelClient: laravelHttpClientService,
  ) { }

  public handle(command: RemoveTokenCommand): Promise<laravelHttpResponseInterface> {

    return this.laravelClient.delete(`/account/tokens/${command.getTokenUuid()}`).toPromise();

  }

}
