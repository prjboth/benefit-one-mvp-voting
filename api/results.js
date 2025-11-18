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

  try {
    const membersFile = '/tmp/members.json'
    const votesFile = '/tmp/votes.json'

    console.log('Reading members and votes...')
    console.log(`Members file: ${membersFile}`)
    console.log(`Votes file: ${votesFile}`)
    
    const members = readJSON(membersFile, [])
    const votes = readJSON(votesFile, [])
    
    console.log(`Found ${members.length} members and ${votes.length} votes`)
    console.log('Votes data:', JSON.stringify(votes, null, 2))
    
    const scores = {}
    members.forEach(member => {
      scores[member.id] = 0
    })
    
    votes.forEach(vote => {
      if (vote.scores && typeof vote.scores === 'object') {
        Object.keys(vote.scores).forEach(memberId => {
          scores[memberId] = (scores[memberId] || 0) + (vote.scores[memberId] || 0)
        })
      }
    })
    
    const results = members.map(member => ({
      ...member,
      totalScore: scores[member.id] || 0
    }))
    
    results.sort((a, b) => b.totalScore - a.totalScore)
    const top3 = results.slice(0, 3)
    
    console.log('Top 3 results:', top3.map(r => ({ name: r.name, score: r.totalScore })))
    
    return res.json({
      results: top3,
      totalVotes: votes.length
    })
  } catch (error) {
    console.error('Error in results API:', error)
    return res.status(500).json({ 
      error: error.message,
      results: [],
      totalVotes: 0
    })
  }
}
