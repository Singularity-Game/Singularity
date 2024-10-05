import { Component, OnDestroy, OnInit } from '@angular/core';
import { PartyService } from '../../party.service';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { Nullable, Optional, PartyDto } from '@singularity/api-interfaces';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'singularity-join-party',
  templateUrl: './join-party.component.html',
  styleUrl: './join-party.component.scss'
})
export class JoinPartyComponent implements OnInit, OnDestroy {
  public party$?: Observable<Optional<PartyDto>>;

  public userName: Nullable<string> = null;
  public profilePictureBase64: Nullable<string> = null;

  public destroySubject = new Subject<void>()

  constructor(private readonly partyService: PartyService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly router: Router) {
  }

  public ngOnInit(): void {
    const id = this.activatedRoute.snapshot.parent?.paramMap.get('id');

    if(!id) {
      return;
    }

    this.party$ = this.partyService.getPartyById$(id)
      .pipe(map((party: Nullable<PartyDto>) => new Optional(party)));
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public setUserName(name: string): void {
    this.userName = name;
  }

  public setProfilePictureBase64(base64: string): void {
    this.profilePictureBase64 = base64;
  }

  public join(partyId: string): void {
    if(!this.userName || this.profilePictureBase64 === null) {
      return;
    }

    this.partyService.joinParty$(partyId, this.userName, this.profilePictureBase64)
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => this.router.navigate(['party', partyId]));
  }

  public cancel(): void {
    this.userName = null;
    this.profilePictureBase64 = null;
  }
}
