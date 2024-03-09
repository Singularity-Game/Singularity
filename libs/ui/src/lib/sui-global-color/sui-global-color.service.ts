import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { extractColors } from 'extract-colors';
import { FinalColor } from 'extract-colors/lib/types/Color';

@Injectable({
  providedIn: 'root'
})
export class SuiGlobalColorService {

  private readonly colorsSubject: BehaviorSubject<[string, string]> = new BehaviorSubject<[string, string]>(['#000000', '#000000'])

  constructor() { }

  public setColorsFromImage(base64: string): void {
    extractColors(base64)
      .then((colors: FinalColor[]) => {
        this.colorsSubject.next([colors[0].hex, colors[1].hex]);
      });
  }

  public setPrimaryColor(color: string): void {

  }

  public setSecondaryColor(color: string): void {

  }

  public getColors$(): Observable<[string, string]> {
    return this.colorsSubject.asObservable();
  }

  public getTextColor$(): Observable<string> {
    return this.getPrimaryColor$()
      .pipe(map((color: string) => {
        let r = 0;
        let g = 0;
        let b = 0;

        if (color.length === 4) {
          r = +("0x" + color[1] + color[1]);
          g = +("0x" + color[2] + color[2]);
          b = +("0x" + color[3] + color[3]);
        } else if (color.length === 7) {
          r = +("0x" + color[1] + color[2]);
          g = +("0x" + color[3] + color[4]);
          b = +("0x" + color[5] + color[6]);
        }

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff'
      }));
  }

  public getPrimaryColor$(): Observable<string> {
    return this.getColors$()
      .pipe(map(([primary]: [string, string]) => primary));
  }

  public getSecondaryColor$(): Observable<string> {
    return this.getColors$()
      .pipe(map(([primary, secondary]: [string, string]) => secondary));
  }
}
