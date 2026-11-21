import { Component, DestroyRef, inject, input } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'singularity-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false
})
export class NavbarComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef)

  public readonly partyEnabled = environment.partyEnabled;

  public readonly user = this.authenticationService.user;
  public readonly transparent = input<boolean>(false);

  public logout(): void {
    this.authenticationService.logout$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['/', 'authentication', 'login'])
      })

  }
}
