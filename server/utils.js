// Utility functions for reading/writing JSON files
// For Vercel Serverless Functions, we use /tmp directory (writable)
// Also use in-memory cache to persist data between invocations in the same runtime

import fs from 'fs'
import { join } from 'path'

// In Vercel, /tmp is writable but data is ephemeral (lost on cold start)
// For production, consider using Vercel KV, Supabase, or MongoDB

// Global variable to share data across all invocations in the same runtime
// This persists between function invocations until the runtime is recycled
if (!global.vercelDataStore) {
  global.vercelDataStore = {}
}

// In-memory cache to persist data between invocations in the same runtime
const memoryCache = global.vercelDataStore

const readJSON = (filePath, defaultValue = []) => {
  try {
    // Use /tmp for Vercel (writable)
    const tmpPath = filePath.startsWith('/tmp') ? filePath : `/tmp${filePath}`
    
    // Check memory cache first
    if (memoryCache[tmpPath]) {
      console.log(`Reading from memory cache: ${tmpPath}`)
      return memoryCache[tmpPath]
    }
    
    // Read from file
    if (fs.existsSync(tmpPath)) {
      const data = fs.readFileSync(tmpPath, 'utf8')
      const parsed = JSON.parse(data)
      // Store in memory cache
      memoryCache[tmpPath] = parsed
      console.log(`Read from file and cached: ${tmpPath}, data length: ${Array.isArray(parsed) ? parsed.length : 'N/A'}`)
      return parsed
    }
    
    console.log(`File not found, using default: ${tmpPath}`)
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
    
    // Write to file
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8')
    
    // Update memory cache
    memoryCache[tmpPath] = data
    console.log(`Written to file and cached: ${tmpPath}, data length: ${Array.isArray(data) ? data.length : 'N/A'}`)
    
    return true
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error)
    return false
  }
}

export { readJSON, writeJSON }
