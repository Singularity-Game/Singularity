import { Injectable } from '@angular/core';
import { BpmService } from './bpm.service';
import { SongDto } from '@singularity/api-interfaces';
import { Singer } from '../singer/singer';
import { MicrophoneService } from './microphone.service';

@Injectable()
export class SingerFactory {
  constructor(private readonly bpmService: BpmService,
              private readonly microphoneService: MicrophoneService) {
  }

  public createSingers(song: SongDto): Singer[] {
    const deviceIds = this.microphoneService.getSelectedMicrophones();

    return deviceIds.map((deviceId: string, index: number) => new Singer(index, this.getSingerColor(index), deviceId, song, this.microphoneService, this.bpmService));
  }

  private getSingerColor(index: number): string {
    switch (index) {
      case 0:
        return '#526ED3';
      case 1:
        return '#FFA3A3';
      case 2:
        return '#B2FFB2';
      case 3:
        return '#FFFFB2';
      case 4:
        return '#FFB2FF';
      case 5:
        return '#FFCFA3';
      case 6:
        return '#D3AED3';
      case 7:
        return '#A3FFFF';
      case 8:
        return '#FFFFFF';
      default:
        return '#000000';
    }
  }
}
