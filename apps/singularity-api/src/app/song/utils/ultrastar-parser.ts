import { SongNote } from "../models/song-note.entity";
import { SongNoteType } from "@singularity/api-interfaces";

export interface UltrastarMetadata {
	artist: string;
	title: string;
	year: number;
	bpm: number;
	gap: number;
	start: number;
	end: number;
	mp3?: string;
	video?: string;
	cover?: string;
}

export class UltrastarParser {
	static parse(txtContent: string): {
		metadata: UltrastarMetadata;
		notes: SongNote[];
		pointsPerBeat: number;
	} {
		const metadata = this.parseMetadata(txtContent);
		const notes = this.parseNotes(txtContent);
		const pointsPerBeat = this.calculatePointsPerBeat(notes);

		return { metadata, notes, pointsPerBeat };
	}

	static parseMetadata(txtContent: string): UltrastarMetadata {
		return {
			artist: this.getMetadataValue(txtContent, "#ARTIST"),
			title: this.getMetadataValue(txtContent, "#TITLE"),
			year: +this.getMetadataValue(txtContent, "#YEAR") || 0,
			bpm: +this.getMetadataValue(txtContent, "#BPM").replace(",", ".") || 120,
			gap: +this.getMetadataValue(txtContent, "#GAP") || 0,
			start: +this.getMetadataValue(txtContent, "#START") || 0,
			end: +this.getMetadataValue(txtContent, "#END") || 0,
			mp3: this.getMetadataValue(txtContent, "#MP3") || undefined,
			video: this.getMetadataValue(txtContent, "#VIDEO") || undefined,
			cover: this.getMetadataValue(txtContent, "#COVER") || undefined,
		};
	}

	static getMetadataValue(txt: string, metadataKey: string): string {
		const lines = txt.split("\n");
		const metadataLine = lines.find((line: string) =>
			line.startsWith(metadataKey),
		);
		if (!metadataLine) return "";

		const metadataValues = metadataLine.split(":");
		return metadataValues.slice(1).join(":").trim();
	}

	static parseNotes(txt: string): SongNote[] {
		const lines = txt.split("\n");
		return lines
			.filter((line: string) => !line.startsWith("#") && line.trim().length > 0)
			.map((line: string) => this.parseNote(line))
			.filter((note: SongNote | null) => note !== null) as SongNote[];
	}

	static parseNote(line: string): SongNote | null {
		const lineArray = line.trim().split(" ");

		if (lineArray.length < 2) return null;

		const songNote = new SongNote();

		switch (lineArray[0]) {
			case ":":
				songNote.type = SongNoteType.Regular;
				break;
			case "*":
				songNote.type = SongNoteType.Golden;
				break;
			case "F":
				songNote.type = SongNoteType.Freestyle;
				break;
			case "-":
				songNote.type = SongNoteType.LineBreak;
				break;
			case "E":
				return null; // End marker
			default:
				return null; // Unknown type, skip gracefully for indexing
		}

		songNote.startBeat = +lineArray[1] || 0;
		songNote.lengthInBeats = +lineArray[2] || 0;
		songNote.pitch = +lineArray[3] || 0;
		songNote.text = lineArray.slice(4).join(" ").replace(/\r?\n/g, "").trim();

		return songNote;
	}

	static calculatePointsPerBeat(songNotes: SongNote[]): number {
		const songNotesWithoutLinebreaks = songNotes.filter(
			(songNote: SongNote) => songNote.type !== SongNoteType.LineBreak,
		);

		const beatCount = songNotesWithoutLinebreaks.reduce(
			(previous: number, current: SongNote) =>
				previous +
				current.lengthInBeats * (current.type === SongNoteType.Golden ? 2 : 1), // Golden Notes give us double points
			0,
		);

		return beatCount > 0 ? 10000 / beatCount : 100;
	}

	static isUltrastarFile(content: string): boolean {
		const lines = content.split("\n").slice(0, 20);
		return lines.some(
			(line) =>
				line.startsWith("#TITLE:") ||
				line.startsWith("#ARTIST:") ||
				line.startsWith("#BPM:"),
		);
	}
}
