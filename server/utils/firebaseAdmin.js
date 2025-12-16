import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

let adminDb
let adminAuth

export const useFirebaseAdmin = () => {
  const apps = getApps()

  if (apps.length === 0) {
    let serviceAccount
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      } catch (e) {
        throw new Error(`Failed to parse process.env.FIREBASE_SERVICE_ACCOUNT: ${e.message}`)
      }
    }
   else if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PROJECT_ID) {
      serviceAccount = {
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
      }
    }
    else {
      const serviceAccountPath = resolve(process.cwd(), 'service-account.json')

      if (!existsSync(serviceAccountPath)) {
        throw new Error(`Service account not found. Checked env vars (FIREBASE_SERVICE_ACCOUNT or FIREBASE_ADMIN_*) and file at: ${serviceAccountPath}`)
      }

      try {
        serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
      } catch (error) {
        throw new Error(`Failed to parse service-account.json: ${error.message}`)
      }
    }

    initializeApp({
      credential: cert(serviceAccount)
    })
  }

  if (!adminDb) {
    adminDb = getFirestore()
  }

  if (!adminAuth) {
    adminAuth = getAuth()
  }

  return { adminDb, adminAuth }
}
