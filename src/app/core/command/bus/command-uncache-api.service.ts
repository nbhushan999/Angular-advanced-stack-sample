import { Injectable } from '@angular/core';
import * as cache from 'js-cache';
import { ContainerService } from '@dxp-web/shared/util/ngx-container-resolver';
import * as commands from '../../command/commands';
import { ofCommand } from '../operators/of-command.operator';

@Injectable()
export class CommandUncacheApiService {

  constructor(
    private container: ContainerService,
  ) {}

  clearCacheOnCommands() {

    this.container.events.pipe(
      ofCommand([
        commands.CreateTokenCommand,
        commands.RemoveTokenCommand,
      ]),
    ).subscribe((event) => {

      this.getApiRequestUrlsForCommand(event.getCommand()).forEach(url => {
        this.clearCacheForUrl(url);
      });

    });

  }

  clearCacheForUrl(urlRegex: string) {

    // if we cannot determine url then clear all cache and return
    if (urlRegex === '') {
      cache.clear();
      return;
    }

    const cachedUrlsToDelete = cache.keys().filter((key: string) => key.match(urlRegex));
    cachedUrlsToDelete.forEach(key => cache.del(key));

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getApiRequestUrlsForCommand(command): string[] {

    switch (true) {

      case command instanceof commands.CreateTokenCommand:
      case command instanceof commands.RemoveTokenCommand:
        return ['/account/tokens'];

      default:
        return [''];

    }

  }

}
