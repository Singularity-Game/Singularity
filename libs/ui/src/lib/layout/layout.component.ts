import { Component } from '@angular/core';
import { SuiGlobalColorService } from '../sui-global-color/sui-global-color.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'sui-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  public colors$ = this.globalColorService.getColors$();
  public textColor$ = this.globalColorService.getTextColor$();

  constructor(private readonly globalColorService: SuiGlobalColorService) {
  }
}
