import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SuiGlobalColorService } from '../sui-global-color/sui-global-color.service';

@Component({
  selector: 'sui-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class LogoComponent {
  private readonly globalColorService = inject(SuiGlobalColorService);

  public colors$ = this.globalColorService.getColors$();
}
