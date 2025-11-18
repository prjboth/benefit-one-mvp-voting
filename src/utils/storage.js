// Utility functions for localStorage

export const getMembers = () => {
  const members = localStorage.getItem('mvp-members')
  return members ? JSON.parse(members) : []
}

export const saveMembers = (members) => {
  localStorage.setItem('mvp-members', JSON.stringify(members))
}

export const getVotes = () => {
  const votes = localStorage.getItem('mvp-votes')
  return votes ? JSON.parse(votes) : []
}

export const saveVote = (vote) => {
  const votes = getVotes()
  votes.push({
    ...vote,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  })
  localStorage.setItem('mvp-votes', JSON.stringify(votes))
}

export const getAllVotes = () => {
  return getVotes()
}

export const calculateResults = () => {
  const votes = getVotes()
  const members = getMembers()
  
  // Initialize scores
  const scores = {}
  members.forEach(member => {
    scores[member.id] = 0
  })
  
  // Sum up all votes
  votes.forEach(vote => {
    Object.keys(vote.scores).forEach(memberId => {
      scores[memberId] = (scores[memberId] || 0) + vote.scores[memberId]
    })
  })
  
  // Convert to array and sort
  const results = members.map(member => ({
    ...member,
    totalScore: scores[member.id] || 0
  }))
  
  results.sort((a, b) => b.totalScore - a.totalScore)
  
  return results
}

export const resetAllVotes = () => {
  localStorage.removeItem('mvp-votes')
}

export const getVoteCount = () => {
  return getVotes().length
}

