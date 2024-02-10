import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'singularity-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
@HostBinding('@authenticationLeaveAnimation')
export class AuthenticationComponent {
}
