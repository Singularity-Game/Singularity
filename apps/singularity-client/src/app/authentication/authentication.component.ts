import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'singularity-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
    standalone: false
})
@HostBinding('@authenticationLeaveAnimation')
export class AuthenticationComponent {
}
