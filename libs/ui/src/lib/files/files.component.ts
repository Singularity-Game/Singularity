import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sui-files',
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss'
})
export class FilesComponent {
  @Input() files: File[] = [];
  @Input() loading = false;
  @Input() success = true;

  @Output() removed = new EventEmitter<void>();
}
