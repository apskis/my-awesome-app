import { NextResponse } from 'next/server'

// Success response helper
export function success(data: any, status: number = 200) {
  return NextResponse.json(data, { status })
}

// Error response helper
export function error(message: string, status: number = 500) {
  return NextResponse.json(
    { error: message },
    { status }
  )
}

// Not found response helper
export function notFound(message: string = 'Resource not found') {
  return NextResponse.json(
    { error: message },
    { status: 404 }
  )
}

// Validation error response helper
export function validationError(errors: any) {
  return NextResponse.json(
    { 
      error: 'Validation failed',
      details: errors 
    },
    { status: 400 }
  )
}

// Bad request response helper
export function badRequest(message: string) {
  return NextResponse.json(
    { error: message },
    { status: 400 }
  )
}
