import { SongDto, SongNoteDto, SongNoteType } from '@singularity/api-interfaces';
import { NoteHelper } from '../../../../shared/helpers/note-helper';
import { VOCAL_GRID_SETTINGS } from './vocal-grid-settings';
import Konva from 'konva';
import { Nullable } from '@singularity/api-interfaces';
import { IFrame } from 'konva/lib/types';
import { UiSongNote } from './ui-song-note';
import { UiNoteLine } from './ui-note-line';
import { UiVocalTrack } from './ui-vocal-track';
import { NormalisedSingerNote } from '../../../singer/normalised-singer-note';
import { Singer } from '../../../singer/singer';

export class UiVocalGrid {
  private noteLines = new Konva.Group();
  private lineAndNoteGroup = new Konva.Group({
    clip: {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: 0
    }
  });
  private group = new Konva.Group();
  private notes: UiSongNote[] = [];
  private vocalTracks: UiVocalTrack[] = [];
  private layer = new Konva.Layer({listening: false});
  private animation: Nullable<Konva.Animation> = null;
  private readonly song: SongDto;
  public width = window.innerWidth;
  public readonly highestNote: number;
  public readonly lowestNote: number;
  private readonly singers: Singer[];
  private readonly microphoneLatency: number;
  public get height(): number {
    return this.noteLines.height() ?? 0;
  }

  constructor(song: SongDto, singers: Singer[], microphoneLatency: number) {
    this.highestNote = song.notes
      .filter((note: SongNoteDto) => note.type !== SongNoteType.LineBreak)
      .reduce((prev: number, curr: SongNoteDto) => curr.pitch > prev ? curr.pitch : prev, -Infinity);
    this.lowestNote = song.notes
      .filter((note: SongNoteDto) => note.type !== SongNoteType.LineBreak)
      .reduce((prev: number, curr: SongNoteDto) => curr.pitch < prev ? curr.pitch : prev, Infinity);

    this.microphoneLatency = microphoneLatency;

    this.song = song;
    this.singers = singers;

    this.lineAndNoteGroup.add(this.noteLines);
    this.group.add(this.lineAndNoteGroup);
    this.layer.add(this.group);

    this.drawNoteLines();
    this.drawNotes();
    this.drawVocalTracks();
  }

  public play(): void {
    let lastStartY = Infinity;

    this.animation = new Konva.Animation((frame?: IFrame) => {
      if(!frame) {
        return;
      }

      const moveAmount = VOCAL_GRID_SETTINGS.noteSpeedInPxPerSecond * (frame.timeDiff / 1000);

      this.notes.forEach(note => {
        note.setX(
          note.getX() - moveAmount
        );
      });

      this.vocalTracks.forEach((track: UiVocalTrack) => {
        track.moveLeft(moveAmount);
      });

      let startY = Infinity;
      let endY = -Infinity;

      this.notes.forEach(note => {
        if (note.getX() > window.innerWidth * 2 || note.getX() + note.getWidth() < 0 || note.getType() === SongNoteType.LineBreak) {
          return;
        }

        if (note.getY() < startY) {
          startY = note.getY();
        }

        if (note.getY() + note.getHeight() > endY) {
          endY = note.getY() + note.getHeight();
        }
      });

      if (startY === Infinity) {
        this.lineAndNoteGroup.clipY(0);
        startY = 0;
      } else if(lastStartY === 0) {
        this.lineAndNoteGroup.clipY(startY);
      }

      lastStartY = startY;

      if (endY === -Infinity) {
        endY = 1;
        this.lineAndNoteGroup.clipHeight(1);
        this.lineAndNoteGroup.clipWidth(1);
      } else {
        this.lineAndNoteGroup.clipWidth(window.innerWidth);
      }

      const diffStart = Math.ceil(startY - this.lineAndNoteGroup.clipY());
      const diffEnd = Math.ceil(endY - this.lineAndNoteGroup.clipHeight() - this.lineAndNoteGroup.clipY());

      const moveClipAmount = VOCAL_GRID_SETTINGS.clipSpeedInPxPerSecond * (frame.timeDiff / 1000);

      if (Math.abs(diffStart) < moveClipAmount) {
        this.lineAndNoteGroup.clipY(startY);
      } else {
        this.lineAndNoteGroup.clipY(diffStart < 0 ? this.lineAndNoteGroup.clipY() - moveClipAmount : this.lineAndNoteGroup.clipY() + moveClipAmount);
      }

      if (Math.abs(diffEnd) < moveClipAmount) {
        this.lineAndNoteGroup.clipHeight(endY - this.lineAndNoteGroup.clipY());
      } else {
        this.lineAndNoteGroup.clipHeight(diffEnd < 0 ? this.lineAndNoteGroup.clipHeight() - moveClipAmount : this.lineAndNoteGroup.clipHeight() +  moveClipAmount);
      }

      this.group.y(window.innerHeight / 2 - this.lineAndNoteGroup.clipHeight() / 2 - this.lineAndNoteGroup.clipY());
    });

    this.animation.start();
  }

  public pause(): void {
    this.animation?.stop();
  }

  public rescale(width: number): void {
    // TODO
  }

  public getLayer(): Konva.Layer {
    return this.layer;
  }

  public addNotes(notes: Nullable<NormalisedSingerNote>[]): void {
    if (notes.length !== this.vocalTracks.length) {
      return; // TODO: Throw Error
    }

    this.vocalTracks.forEach((track: UiVocalTrack, index: number) => {
      track.addNote(notes[index]);
    })
  }

  private drawNotes(): void {
    this.song.notes.forEach((songNote: SongNoteDto) => {
      const note = new UiSongNote(songNote, this.song);
      const object = note.getKonvaObject();
      if(object !== null) {
        this.lineAndNoteGroup.add(object);
      }

      this.notes.push(note);
    });
  }

  private drawNoteLines(): void {
    const totalNotes = this.highestNote - this.lowestNote + 1;

    for (let i = 0; i < totalNotes; i++) {
      const noteLine = new UiNoteLine(i, NoteHelper.getNote(this.highestNote - i));
      this.noteLines.add(noteLine.getKonvaObject());
    }
  }

  private drawVocalTracks(): void {
    this.singers.forEach((singer: Singer) => {
      const vocalTrack = new UiVocalTrack(this.highestNote, singer.color, this.microphoneLatency);
      this.vocalTracks.push(vocalTrack);
      this.group.add(vocalTrack.getKonvaObject());
    });
  }
}
