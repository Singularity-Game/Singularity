import { PitchDetector } from './pitch-detector';
import * as Tone from 'tone';
import { Nullable } from '@singularity/api-interfaces';
import { MicrophoneService } from '../services/microphone.service';
import { BpmService } from '../services/bpm.service';
import { SongDto, SongNoteDto, SongNoteType } from '@singularity/api-interfaces';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  Observable,
  scan,
  startWith,
  switchMap
} from 'rxjs';
import { NormalisedSingerNote } from './normalised-singer-note';
import { SingerNote } from './singer-note';

export class Singer {
  constructor(public readonly id: number,
              public readonly color: string,
              private readonly deviceId: string,
              private readonly song: SongDto,
              private readonly microphoneService: MicrophoneService,
              private readonly bpmService: BpmService) {
  }

  public getSingerScore$(): Observable<number> {
    return combineLatest([this.getSingerNote$(), this.bpmService.getBeatWithMicrophoneLatency$()])
      .pipe(
        filter(([singerNote, beat]: [Nullable<NormalisedSingerNote>, number]) => {
          const songNote = this.song.notes.find((songNote: SongNoteDto) =>
            songNote.startBeat <= beat
            && songNote.lengthInBeats + songNote.startBeat >= beat
            && songNote.type !== SongNoteType.LineBreak);

          if (!songNote || !singerNote) {
            return false; // No songNote or no singerNote gives us no score for this beat.
          }

          // singerNote is within tolerance gives us a score for this beat.
          // otherwise we won't get any score for this beat.
          return Math.abs(songNote.pitch - singerNote.noteNumberFloat) < 1;
        }),
        map(([singerNote, beat]: [Nullable<NormalisedSingerNote>, number]) => beat), // from now on only the beat that got a score is relevant
        distinctUntilChanged(), // we do not want to count a beat twice
        map((beat: number) => {
          const songNote = this.song.notes.find((songNote: SongNoteDto) =>
            songNote.startBeat <= beat
            && songNote.lengthInBeats + songNote.startBeat >= beat
            && songNote.type !== SongNoteType.LineBreak);

          if (!songNote) {
            return 0; // SongNote cannot be null here, because we checked it earlier. But just in case, we won't get any score for this beat if there is no songNote
          }

          if (songNote.type === SongNoteType.Golden) {
            return this.song.pointsPerBeat * 2; // Golden Notes give us double the score
          }

          return this.song.pointsPerBeat; // Otherwise we will add 1 to the score
        }),
        startWith(0),
        scan((acc: number, curr: number) => curr + acc, 0), // Add it all up
      );
  }

  public getSingerNote$(): Observable<Nullable<NormalisedSingerNote>> {
    const pitchDetectors: PitchDetector[] = [];
    const streams: MediaStream[] = [];

    return this.microphoneService.getDeviceStream$(this.deviceId)
      .pipe(
        switchMap((stream: MediaStream) => {
          const sourceNode = Tone.context.createMediaStreamSource(stream);
          const pitchDetector = new PitchDetector(sourceNode);

          pitchDetectors.push(pitchDetector);
          streams.push(stream);

          return this.getNormalisedSingerNote$(pitchDetector);
        }),
        finalize(() => {
          pitchDetectors.forEach((pitchDetector: PitchDetector) => pitchDetector.dispose());
          streams.forEach((stream: MediaStream) => stream.getTracks().forEach(track => track.stop()));
        }),
      )
  }

  private getNormalisedSingerNote$(pitchDetector: PitchDetector): Observable<Nullable<NormalisedSingerNote>> {
    return combineLatest([pitchDetector.getNote$(), this.bpmService.getBeatWithMicrophoneLatency$().pipe(startWith(-1))])
      .pipe(
        map(([singerNote, beat]: [Nullable<SingerNote>, number]) => {
          if (singerNote === null) {
            return null;
          }

          const songNote = this.findClosestSongNote(beat, this.song.notes);
          const songNoteNumber = songNote.pitch;
          if (songNoteNumber != null) {
            return singerNote.normalize(songNoteNumber);
          } else {
            return singerNote;
          }
        })
      );
  }

  private findClosestSongNote(beat: number, songNotes: SongNoteDto[]): SongNoteDto {
    let closestSongNote = songNotes[0];
    let closestSongNoteDistance = Infinity;

    songNotes.forEach((songNote: SongNoteDto) => {
      const distance1 = Math.abs(beat - songNote.startBeat);
      const distance2 = Math.abs(beat - songNote.startBeat + songNote.lengthInBeats);
      const distance = Math.min(distance1, distance2);

      if (distance < closestSongNoteDistance) {
        closestSongNote = songNote;
        closestSongNoteDistance = distance;
      }
    });

    return closestSongNote;
  }
}
