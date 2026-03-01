import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

function envValue(key: string): string | undefined {
  const value = process.env[key]
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const projectId = envValue('NEXT_PUBLIC_FIREBASE_PROJECT_ID') ?? 'demo-project'

const firebaseConfig = {
  apiKey: envValue('NEXT_PUBLIC_FIREBASE_API_KEY') ?? 'demo-key',
  authDomain:
    envValue('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN') ??
    `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket:
    envValue('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET') ??
    `${projectId}.appspot.com`,
  messagingSenderId:
    envValue('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID') ?? 'demo',
  appId: envValue('NEXT_PUBLIC_FIREBASE_APP_ID') ?? '1:demo:web:demo',
  databaseURL:
    envValue('NEXT_PUBLIC_FIREBASE_DATABASE_URL') ??
    `https://${projectId}-default-rtdb.firebaseio.com`,
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const rtdb = getDatabase(app)
