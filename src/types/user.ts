import { IsString, IsEmail, IsUrl, IsOptional } from 'class-validator'

export type Profile = {
  id: string           // UUID from auth.users
  username?: string
  email: string
  display_name?: string
  avatar_url?: string
  created_at: Date
  updated_at: Date
}

export type User = {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export class User {
  @IsString()
  id!: string

  @IsString()
  @IsOptional()
  name?: string | null

  @IsEmail()
  @IsOptional()
  email?: string | null

  @IsUrl()
  @IsOptional()
  image?: string | null
} 