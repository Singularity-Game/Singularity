import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { PartyParticipantService } from '../party-participant.service';

@Injectable({
  providedIn: 'root'
})
export class PartyParticipantGuard implements CanActivate {
  constructor(private readonly partyParticipantService: PartyParticipantService,
              private readonly router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const id = route.paramMap.get('id');

    if(!id) {
      return false;
    }

    return this.partyParticipantService.isParticipant$(id)
      .pipe(map((value) => {
        if (!value) {
          return this.router.createUrlTree(['party', id, 'join'])
        }

        return true;
      }));
  }
  
}
