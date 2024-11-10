import { Pipe, PipeTransform } from '@angular/core';
import { PartyQueueItemDto } from '@singularity/api-interfaces';

@Pipe({
  name: 'partySongsReadyFilter'
})
export class PartySongsReadyFilterPipe implements PipeTransform {

  transform(value: PartyQueueItemDto[]): PartyQueueItemDto[] {
    return value.filter(queueItem => queueItem.ready);
  }

}
