import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  first_name: string;
  last_name: string;
  birthdate: Date;
  location: string;
  created_at: string;
  updated_at: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}