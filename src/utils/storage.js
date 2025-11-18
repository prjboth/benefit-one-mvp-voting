// API-based storage functions (replaces localStorage)

import { api } from './api'

// Fallback to localStorage if API fails
const useLocalStorage = false

// Members
export const getMembers = async () => {
  if (useLocalStorage) {
    const members = localStorage.getItem('mvp-members')
    return members ? JSON.parse(members) : []
  }
  try {
    return await api.getMembers()
  } catch (error) {
    console.error('Failed to fetch members:', error)
    // Fallback to localStorage
    const members = localStorage.getItem('mvp-members')
    return members ? JSON.parse(members) : []
  }
}

export const saveMembers = async (members) => {
  if (useLocalStorage) {
    localStorage.setItem('mvp-members', JSON.stringify(members))
    return
  }
  // For API, we need to save individually
  // This is handled in the Import component
}

export const addMember = async (member) => {
  try {
    await api.addMember(member)
  } catch (error) {
    console.error('Failed to add member:', error)
    throw error
  }
}

export const updateMember = async (id, member) => {
  try {
    await api.updateMember(id, member)
  } catch (error) {
    console.error('Failed to update member:', error)
    throw error
  }
}

export const deleteMember = async (id) => {
  try {
    await api.deleteMember(id)
  } catch (error) {
    console.error('Failed to delete member:', error)
    throw error
  }
}

// Votes
export const getVotes = async () => {
  if (useLocalStorage) {
    const votes = localStorage.getItem('mvp-votes')
    return votes ? JSON.parse(votes) : []
  }
  try {
    return await api.getVotes()
  } catch (error) {
    console.error('Failed to fetch votes:', error)
    const votes = localStorage.getItem('mvp-votes')
    return votes ? JSON.parse(votes) : []
  }
}

export const saveVote = async (vote) => {
  if (useLocalStorage) {
    const votes = getVotes()
    votes.push({
      ...vote,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    })
    localStorage.setItem('mvp-votes', JSON.stringify(votes))
    return
  }
  try {
    await api.submitVote({
      voterName: vote.voterName,
      scores: vote.scores
    })
  } catch (error) {
    console.error('Failed to submit vote:', error)
    throw error
  }
}

export const getAllVotes = async () => {
  return await getVotes()
}

// Results (top 3 only)
export const calculateResults = async () => {
  if (useLocalStorage) {
    const votes = await getVotes()
    const members = await getMembers()
    
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
    return {
      results: results.slice(0, 3), // Top 3 only
      totalVotes: votes.length
    }
  }
  
  try {
    const data = await api.getResults()
    return data // { results: [...], totalVotes: number }
  } catch (error) {
    console.error('Failed to fetch results:', error)
    return { results: [], totalVotes: 0 }
  }
}

export const resetAllVotes = async () => {
  if (useLocalStorage) {
    localStorage.removeItem('mvp-votes')
    return
  }
  try {
    await api.resetVotes()
  } catch (error) {
    console.error('Failed to reset votes:', error)
    throw error
  }
}

export const getVoteCount = async () => {
  if (useLocalStorage) {
    const votes = getVotes()
    return votes.length
  }
  try {
    return await api.getVoteCount()
  } catch (error) {
    console.error('Failed to get vote count:', error)
    return 0
  }
}

// Vote logs
export const getVoteLogs = async (voteId = null) => {
  try {
    return await api.getVoteLogs(voteId)
  } catch (error) {
    console.error('Failed to fetch vote logs:', error)
    return []
  }
}
