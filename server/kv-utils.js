// Utility functions for Vercel KV storage
// Vercel KV is a persistent key-value store that works across all serverless functions

import { kv } from '@vercel/kv'

// Keys for different data types
const KEYS = {
  MEMBERS: 'mvp:members',
  VOTES: 'mvp:votes',
  LOGS: 'mvp:logs',
  LUCKY_DRAW_LOGS: 'mvp:luckyDrawLogs'
}

// Read data from KV
export const readKV = async (key, defaultValue = []) => {
  try {
    // Check if KV is configured
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error('KV Environment Variables not set!')
      console.error('KV_REST_API_URL:', process.env.KV_REST_API_URL ? 'Set' : 'Missing')
      console.error('KV_REST_API_TOKEN:', process.env.KV_REST_API_TOKEN ? 'Set' : 'Missing')
      throw new Error('Vercel KV is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.')
    }
    
    const data = await kv.get(key)
    if (data === null) {
      console.log(`KV key not found: ${key}, using default`)
      return defaultValue
    }
    console.log(`KV read: ${key}, data length: ${Array.isArray(data) ? data.length : 'N/A'}`)
    return data
  } catch (error) {
    console.error(`Error reading KV ${key}:`, error)
    console.error('Error details:', error.message, error.stack)
    throw error
  }
}

// Write data to KV
export const writeKV = async (key, data) => {
  try {
    // Check if KV is configured
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error('KV Environment Variables not set!')
      console.error('KV_REST_API_URL:', process.env.KV_REST_API_URL ? 'Set' : 'Missing')
      console.error('KV_REST_API_TOKEN:', process.env.KV_REST_API_TOKEN ? 'Set' : 'Missing')
      throw new Error('Vercel KV is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.')
    }
    
    await kv.set(key, data)
    console.log(`KV written: ${key}, data length: ${Array.isArray(data) ? data.length : 'N/A'}`)
    return true
  } catch (error) {
    console.error(`Error writing KV ${key}:`, error)
    console.error('Error details:', error.message, error.stack)
    throw error
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

// Lucky Draw Logs operations
export const getLuckyDrawLogs = () => readKV(KEYS.LUCKY_DRAW_LOGS, [])
export const setLuckyDrawLogs = (logs) => writeKV(KEYS.LUCKY_DRAW_LOGS, logs)

export { KEYS }

