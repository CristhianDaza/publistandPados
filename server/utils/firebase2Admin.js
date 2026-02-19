import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

const FIREBASE2_APP_NAME = 'firebase2-admin'

let adminDb2

const parseServiceAccountJson = (raw, label) => {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (error) {
    throw new Error(`Failed to parse ${label}: ${error.message}`)
  }
}

const loadFirebase2ServiceAccount = () => {
  const fromJsonEnv = parseServiceAccountJson(process.env.FIREBASE2_SERVICE_ACCOUNT, 'process.env.FIREBASE2_SERVICE_ACCOUNT')
  if (fromJsonEnv) return fromJsonEnv

  const hasSplitEnv = process.env.FIREBASE2_ADMIN_PRIVATE_KEY && process.env.FIREBASE2_ADMIN_CLIENT_EMAIL && process.env.FIREBASE2_ADMIN_PROJECT_ID
  if (hasSplitEnv) {
    return {
      projectId: process.env.FIREBASE2_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE2_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE2_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
    }
  }

  const fallbackJson = parseServiceAccountJson(process.env.FIREBASE_SERVICE_ACCOUNT, 'process.env.FIREBASE_SERVICE_ACCOUNT')
  if (fallbackJson) return fallbackJson

  const hasFallbackSplitEnv = process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PROJECT_ID
  if (hasFallbackSplitEnv) {
    return {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
    }
  }

  const serviceAccountPath = resolve(process.cwd(), 'service-account.json')
  if (!existsSync(serviceAccountPath)) {
    throw new Error('Firebase2 service account not found. Set FIREBASE2_SERVICE_ACCOUNT or FIREBASE2_ADMIN_* env vars.')
  }

  try {
    return JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
  } catch (error) {
    throw new Error(`Failed to parse service-account.json: ${error.message}`)
  }
}

export const useFirebase2Admin = () => {
  let app
  const existing = getApps().find((candidate) => candidate.name === FIREBASE2_APP_NAME)

  if (existing) {
    app = getApp(FIREBASE2_APP_NAME)
  } else {
    const serviceAccount = loadFirebase2ServiceAccount()
    app = initializeApp(
      { credential: cert(serviceAccount) },
      FIREBASE2_APP_NAME
    )
  }

  if (!adminDb2) {
    adminDb2 = getFirestore(app)
  }

  return { adminDb2 }
}
