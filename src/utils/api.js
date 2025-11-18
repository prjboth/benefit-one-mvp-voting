// API client for backend server

// Auto-detect API URL based on environment
const getApiUrl = () => {
  // If VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // If running on Vercel, use same origin
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return '/api'
  }
  
  // Default to localhost for development
  return 'http://localhost:3001/api'
}

const API_BASE_URL = getApiUrl()

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Members API
export const api = {
  // Get all members
  getMembers: () => apiCall('/members'),
  
  // Add member
  addMember: (member) => apiCall('/members', {
    method: 'POST',
    body: JSON.stringify(member)
  }),
  
  // Update member
  updateMember: (id, member) => apiCall(`/members/${id}`, {
    method: 'PUT',
    body: JSON.stringify(member)
  }),
  
  // Delete member
  deleteMember: (id) => apiCall(`/members/${id}`, {
    method: 'DELETE'
  }),
  
  // Get all votes
  getVotes: () => apiCall('/votes'),
  
  // Submit vote
  submitVote: (vote) => apiCall('/votes', {
    method: 'POST',
    body: JSON.stringify(vote)
  }),
  
  // Get results (top 3)
  getResults: () => apiCall('/results'),
  
  // Get vote logs
  getVoteLogs: (voteId = null) => {
    if (voteId) {
      return apiCall(`/vote-logs/${voteId}`)
    }
    return apiCall('/vote-logs')
  },
  
  // Reset all votes
  resetVotes: () => apiCall('/votes', {
    method: 'DELETE'
  }),
  
  // Get vote count
  getVoteCount: async () => {
    const votes = await apiCall('/votes')
    return votes.length
  }
}

