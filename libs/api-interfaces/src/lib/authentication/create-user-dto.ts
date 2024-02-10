export class CreateUserDto {
  username!: string;
  email!: string;
  profilePictureBase64?: string;
  isAdmin?: boolean;
}
