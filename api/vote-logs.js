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
  const logs = readJSON(logsFile, [])
  const recentLogs = logs.slice(-100).reverse()
  return res.json(recentLogs)
}
