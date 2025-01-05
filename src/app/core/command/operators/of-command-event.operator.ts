import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommandSucceededEvent } from '../event';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ofCommandSucceededEvent = (commands: any[]) => (source: Observable<CommandSucceededEvent>) => (
  source.pipe(
    filter(
      e => e instanceof CommandSucceededEvent,
    ),
    filter(
      e => commands.some(c => e.getCommand() instanceof c),
    ),
  )
);
