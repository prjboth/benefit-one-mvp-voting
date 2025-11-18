// Utility functions for reading/writing JSON files
// For Vercel Serverless Functions, we use /tmp directory (writable)

import fs from 'fs'
import { join } from 'path'

// In Vercel, /tmp is writable but data is ephemeral (lost on cold start)
// For production, consider using Vercel KV, Supabase, or MongoDB

const readJSON = (filePath, defaultValue = []) => {
  try {
    // Use /tmp for Vercel (writable)
    const tmpPath = filePath.startsWith('/tmp') ? filePath : `/tmp${filePath}`
    
    if (fs.existsSync(tmpPath)) {
      const data = fs.readFileSync(tmpPath, 'utf8')
      return JSON.parse(data)
    }
    return defaultValue
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return defaultValue
  }
}

const writeJSON = (filePath, data) => {
  try {
    // Use /tmp for Vercel (writable)
    const tmpPath = filePath.startsWith('/tmp') ? filePath : `/tmp${filePath}`
    
    // Ensure directory exists
    const dir = join(tmpPath, '..')
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error)
    return false
  }
}

export { readJSON, writeJSON }
