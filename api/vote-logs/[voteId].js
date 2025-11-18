import { getLogs } from '../../../server/kv-utils.js'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { query } = req
    const { voteId } = query
    
    const logs = await getLogs()
    const voteLogs = logs.filter(log => log.voteId === voteId)
    return res.json(voteLogs)
  } catch (error) {
    console.error('Error in GET /api/vote-logs/:voteId:', error)
    return res.status(500).json({ error: error.message })
  }
}
