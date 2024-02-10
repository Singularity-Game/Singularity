import { Component, Input, OnInit } from '@angular/core';
import { SongDto, SongNoteDto, SongNoteType } from '@singularity/api-interfaces';
import { findLastIndex } from '../../../shared/helpers/find-last-index';

@Component({
  selector: 'singularity-lyrics',
  templateUrl: './lyrics.component.html',
  styleUrls: ['./lyrics.component.scss'],
})
export class LyricsComponent implements OnInit {
  @Input() public set song(song: SongDto | null) {
    if (song === null) {
      this.sortedNotes = [];
      this.bpm = null;
      return;
    }
    this.sortedNotes = song.notes.sort((note1: SongNoteDto, note2: SongNoteDto) => note1.startBeat - note2.startBeat);
    this.bpm = song.bpm;
  }

  @Input() public set currentBeat(beat: number | null) {
    if (beat === null) {
      return;
    }
    this.setCurrentLine(beat);
    this.setNextLine();
    this.setCurrentNote(beat);
  }

  public currentLine: SongNoteDto[] = [];
  public nextLine: SongNoteDto[] = [];
  public currentNote: SongNoteDto | null = null;
  public bpm: number | null = null;

  private sortedNotes: SongNoteDto[] = [];

  public ngOnInit(): void {
    this.setCurrentLine(0);
    this.setNextLine();
  }

  private setCurrentLine(beat: number): void {
    if (!this.sortedNotes) {
      return;
    }

    if (this.currentLine.length > 0 && beat <= this.currentLine[this.currentLine.length - 1].startBeat) {
      return;
    }

    const lastLineBreakIndex = findLastIndex(this.sortedNotes, (songNote: SongNoteDto) => songNote.type === SongNoteType.LineBreak && songNote.startBeat <= beat);
    const lastLineBreakBeat = lastLineBreakIndex >= 0 ? this.sortedNotes[lastLineBreakIndex].startBeat : 0;
    const nextLineBreakBeat = this.sortedNotes.find((songNote: SongNoteDto) => songNote.type === SongNoteType.LineBreak && songNote.startBeat >= beat)?.startBeat ?? Infinity;


    this.currentLine = this.sortedNotes.filter((songNote: SongNoteDto) => songNote.startBeat >= lastLineBreakBeat && songNote.startBeat <= nextLineBreakBeat);
  }

  private setNextLine(): void {
    if (!this.sortedNotes) {
      return;
    }

    if (this.currentLine.length === 0) {
      return;
    }

    const currentLineBreakBeat = this.currentLine[this.currentLine.length - 1].startBeat;
    const nextLineBreakBeat = this.sortedNotes.find((songNote: SongNoteDto) => songNote.type === SongNoteType.LineBreak && songNote.startBeat > currentLineBreakBeat)?.startBeat ?? Infinity;

    this.nextLine = this.sortedNotes.filter((songNote: SongNoteDto) => songNote.startBeat > currentLineBreakBeat && songNote.startBeat <= nextLineBreakBeat);
  }

  private setCurrentNote(beat: number): void {
    if (!this.sortedNotes) {
      return;
    }

    if (this.currentLine.length === 0) {
      return;
    }

    this.currentNote = this.currentLine.find((songNote: SongNoteDto) => songNote.startBeat <= beat && songNote.startBeat + songNote.lengthInBeats >= beat) ?? null;
  }
}
