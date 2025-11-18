// Utility functions for Vercel KV storage
// Vercel KV is a persistent key-value store that works across all serverless functions

import { kv } from '@vercel/kv'

// Keys for different data types
const KEYS = {
  MEMBERS: 'mvp:members',
  VOTES: 'mvp:votes',
  LOGS: 'mvp:logs'
}

// Read data from KV
export const readKV = async (key, defaultValue = []) => {
  try {
    const data = await kv.get(key)
    if (data === null) {
      console.log(`KV key not found: ${key}, using default`)
      return defaultValue
    }
    console.log(`KV read: ${key}, data length: ${Array.isArray(data) ? data.length : 'N/A'}`)
    return data
  } catch (error) {
    console.error(`Error reading KV ${key}:`, error)
    return defaultValue
  }
}

// Write data to KV
export const writeKV = async (key, data) => {
  try {
    await kv.set(key, data)
    console.log(`KV written: ${key}, data length: ${Array.isArray(data) ? data.length : 'N/A'}`)
    return true
  } catch (error) {
    console.error(`Error writing KV ${key}:`, error)
    return false
  }
}

// Members operations
export const getMembers = () => readKV(KEYS.MEMBERS, [])
export const setMembers = (members) => writeKV(KEYS.MEMBERS, members)

// Votes operations
export const getVotes = () => readKV(KEYS.VOTES, [])
export const setVotes = (votes) => writeKV(KEYS.VOTES, votes)

// Logs operations
export const getLogs = () => readKV(KEYS.LOGS, [])
export const setLogs = (logs) => writeKV(KEYS.LOGS, logs)

export { KEYS }

