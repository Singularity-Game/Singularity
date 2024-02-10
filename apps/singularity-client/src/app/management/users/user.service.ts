import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { Observable } from 'rxjs';
import { CreateUserDto, UserDto, UUID } from '@singularity/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly api: ApiService) { }

  public getAllUsers$(): Observable<UserDto[]> {
    return this.api.get$('api/user');
  }

  public getUserById$(id: number): Observable<UserDto> {
    return this.api.get$(`api/user/${id}`);
  }

  public updateUser$(id: number, user: UserDto): Observable<UserDto> {
    return this.api.put$(`api/user/${id}`, user);
  }

  public deleteUser$(id: number): Observable<UserDto> {
    return this.api.delete$(`api/user/${id}`);
  }

  public createUser$(username: string, email: string, profilePictureBase64: string, isAdmin: boolean): Observable<UserDto> {
    return this.api.post$('api/user', {
      username: username,
      email: email,
      profilePictureBase64: profilePictureBase64,
      isAdmin: isAdmin
    } as CreateUserDto)
  }
}
