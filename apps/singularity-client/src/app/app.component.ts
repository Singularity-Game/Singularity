import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MicrophoneService } from './sing/services/microphone.service';

@Component({
    selector: 'singularity-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Eager
})
export class AppComponent implements OnInit {
    constructor(private readonly microphoneService: MicrophoneService) {
    }

    public ngOnInit(): void {
        this.microphoneService.requestPermission$().subscribe({
            error: (error: unknown) => console.error('Unable to access the microphone', error)
        });
    }
}
