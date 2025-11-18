import { readJSON } from '../server/utils.js'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const logsFile = '/tmp/logs.json'
  console.log('Reading vote logs from:', logsFile)
  const logs = readJSON(logsFile, [])
  console.log(`Found ${logs.length} logs`)
  const recentLogs = logs.slice(-100).reverse()
  console.log(`Returning ${recentLogs.length} recent logs`)
  return res.json(recentLogs)
}
