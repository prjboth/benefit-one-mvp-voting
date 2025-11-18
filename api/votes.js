import { readJSON, writeJSON } from '../server/utils.js'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { method } = req
  const votesFile = '/tmp/votes.json'
  const logsFile = '/tmp/logs.json'
  const membersFile = '/tmp/members.json'

  if (method === 'GET') {
    const votes = readJSON(votesFile, [])
    console.log(`GET /api/votes: Returning ${votes.length} votes`)
    return res.json(votes)
  }

  if (method === 'POST') {
    try {
      const { voterName, scores } = req.body
      console.log('Received vote:', { voterName, scores })
      
      if (!voterName || !scores) {
        return res.status(400).json({ error: 'Missing voterName or scores' })
      }
      
      const voteId = Date.now().toString()
      const timestamp = new Date().toISOString()
      
      const vote = { id: voteId, voterName, timestamp, scores }
      const votes = readJSON(votesFile, [])
      votes.push(vote)
      const writeSuccess = writeJSON(votesFile, votes)
      
      if (!writeSuccess) {
        console.error('Failed to write votes file')
        return res.status(500).json({ error: 'Failed to save vote' })
      }
      
      console.log(`Vote saved successfully. Total votes: ${votes.length}`)
      
      // Create logs
      const logs = readJSON(logsFile, [])
      const members = readJSON(membersFile, [])
      
      Object.keys(scores).forEach(memberId => {
        const score = scores[memberId]
        if (score > 0) {
          const member = members.find(m => m.id === memberId)
          const memberName = member ? member.name : 'Unknown'
          logs.push({ voteId, voterName, memberId, memberName, score, timestamp })
        }
      })
      
      writeJSON(logsFile, logs)
      console.log(`Logs updated. Total logs: ${logs.length}`)
      
      return res.json({ success: true, id: voteId })
    } catch (error) {
      console.error('Error in POST /api/votes:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  if (method === 'DELETE') {
    writeJSON(votesFile, [])
    writeJSON(logsFile, [])
    return res.json({ success: true })
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
  return res.status(405).end()
}
