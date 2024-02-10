import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'singularity-sing-page',
  templateUrl: './sing-page.component.html',
  styleUrls: ['./sing-page.component.scss'],
})
export class SingPageComponent implements OnInit {
  public songId: number | null = null;

  private wasFullScreen = false;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly router: Router) {}

  public ngOnInit() {
    const songId = this.activatedRoute.snapshot.paramMap.get('id');
    this.songId = songId ? +songId : null;

    if(this.checkFullScreen()) {
      this.wasFullScreen = true;
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  public onStop(): void {
    if (!this.wasFullScreen && this.checkFullScreen()) {
      document.exitFullscreen();
    }

    const referer = decodeURI(this.activatedRoute.snapshot.queryParams.referer);
    const refererArray = referer.split('/');
    this.router.navigate(['/', ...refererArray]);
  }

  private checkFullScreen(): boolean {
    return window.innerHeight == screen.height;
  }
}
