import { IsString, IsEmail, IsUrl, IsOptional } from 'class-validator'
import { Book } from './Book'

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

export type ReadingList = {
  id: string
  name: string
  description?: string 
  is_public: boolean
  created_at: Date
  updated_at: Date
  books: Book[]
}