import { getLogs } from '../server/kv-utils.js'

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
    console.log('Reading vote logs from KV...')
    const logs = await getLogs()
    console.log(`Found ${logs.length} logs`)
    const recentLogs = logs.slice(-100).reverse()
    console.log(`Returning ${recentLogs.length} recent logs`)
    return res.json(recentLogs)
  } catch (error) {
    console.error('Error in GET /api/vote-logs:', error)
    return res.status(500).json({ error: error.message })
  }
}
