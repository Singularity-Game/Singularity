import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SuiGlobalColorService } from '@singularity/ui';
import { ToastService } from '@singularity/ui';

@Component({
  selector: 'sui-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class LayoutComponent {
  private readonly globalColorService = inject(SuiGlobalColorService);
  private readonly toastService = inject(ToastService);

  public colors$ = this.globalColorService.getColors$();
  public toasts$ = this.toastService.getToasts$();
}
