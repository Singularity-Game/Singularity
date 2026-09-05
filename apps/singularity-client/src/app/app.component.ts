import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'singularity-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Eager
})
export class AppComponent {}
