// API client for backend server

// Auto-detect API URL based on environment
const getApiUrl = () => {
  // If VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // If running on Vercel, use same origin
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
      return '/api'
    }
  }
  
  // Default to localhost for development
  return 'http://localhost:3001/api'
}

const API_BASE_URL = getApiUrl()

console.log('API Base URL:', API_BASE_URL)

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  console.log('API Call:', url, options.method || 'GET')
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    console.log('API Response status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.warn('Non-JSON response:', text)
      throw new Error('Invalid response format: expected JSON')
    }
    
    const data = await response.json()
    console.log('API Response data:', data)
    return data
  } catch (error) {
    console.error('API call failed:', error)
    console.error('Error details:', error.message)
    // In production, throw error to be handled by caller
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
  deleteMember: (id) => {
    console.log('Deleting member with id:', id)
    return apiCall(`/members/${id}`, {
      method: 'DELETE'
    })
  },
  
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
