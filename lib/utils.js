import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import User from '../models/User'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export async function generateUsername(name) {
  const baseUsername = name.toLowerCase().replace(/\s+/g, '')
  let username = baseUsername
  let counter = 1

  while (await User.findOne({ username })) {
    username = `${baseUsername}${counter}`
    counter++
  }

  return username
}

export function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
