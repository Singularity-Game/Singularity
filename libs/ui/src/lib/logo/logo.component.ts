import { Component } from '@angular/core';
import { SuiGlobalColorService } from '../sui-global-color/sui-global-color.service';

@Component({
  selector: 'sui-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {

  public colors$ = this.globalColorService.getColors$();

  constructor(private readonly globalColorService: SuiGlobalColorService) {
  }
}
