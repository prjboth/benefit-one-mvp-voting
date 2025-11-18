import { getLuckyDrawLogs, setLuckyDrawLogs } from '../server/kv-utils.js'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { method } = req

  if (method === 'GET') {
    try {
      console.log('Reading lucky draw logs from KV...')
      const logs = await getLuckyDrawLogs()
      console.log(`Found ${logs.length} lucky draw logs`)
      // Return most recent first
      const recentLogs = logs.slice(-100).reverse()
      console.log(`Returning ${recentLogs.length} recent logs`)
      return res.json(recentLogs)
    } catch (error) {
      console.error('Error in GET /api/lucky-draw-logs:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  if (method === 'POST') {
    try {
      const { drawId, timestamp, winners, drawCount } = req.body
      console.log('Received lucky draw log:', { drawId, timestamp, winners, drawCount })
      
      if (!drawId || !timestamp || !winners || !Array.isArray(winners)) {
        return res.status(400).json({ error: 'Missing required fields: drawId, timestamp, winners' })
      }
      
      const logs = await getLuckyDrawLogs()
      const logEntry = {
        drawId,
        timestamp,
        winners,
        drawCount: drawCount || winners.length
      }
      logs.push(logEntry)
      
      const writeSuccess = await setLuckyDrawLogs(logs)
      if (!writeSuccess) {
        console.error('Failed to write lucky draw logs to KV')
        return res.status(500).json({ error: 'Failed to save lucky draw log' })
      }
      
      console.log(`Lucky draw log saved successfully. Total logs: ${logs.length}`)
      return res.json({ success: true, id: drawId })
    } catch (error) {
      console.error('Error in POST /api/lucky-draw-logs:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end()
}

