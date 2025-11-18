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

  const membersFile = '/tmp/members.json'
  const votesFile = '/tmp/votes.json'

  const members = readJSON(membersFile, [])
  const votes = readJSON(votesFile, [])
  
  const scores = {}
  members.forEach(member => {
    scores[member.id] = 0
  })
  
  votes.forEach(vote => {
    Object.keys(vote.scores).forEach(memberId => {
      scores[memberId] = (scores[memberId] || 0) + vote.scores[memberId]
    })
  })
  
  const results = members.map(member => ({
    ...member,
    totalScore: scores[member.id] || 0
  }))
  
  results.sort((a, b) => b.totalScore - a.totalScore)
  const top3 = results.slice(0, 3)
  
  return res.json({
    results: top3,
    totalVotes: votes.length
  })
}
