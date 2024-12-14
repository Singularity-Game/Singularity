import { Component } from '@angular/core';
import { SuiGlobalColorService } from '../sui-global-color/sui-global-color.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'sui-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  public colors$ = this.globalColorService.getColors$();
  public toasts$ = this.toastService.getToasts$();

  constructor(private readonly globalColorService: SuiGlobalColorService,
              private readonly toastService: ToastService) {
  }
}
