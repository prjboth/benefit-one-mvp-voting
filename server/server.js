import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(join(__dirname, '../dist')))

// Data file paths
const dataDir = join(__dirname, 'data')
const membersFile = join(dataDir, 'members.json')
const votesFile = join(dataDir, 'votes.json')
const logsFile = join(dataDir, 'logs.json')

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Helper functions to read/write JSON files
const readJSON = (filePath, defaultValue = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    }
    return defaultValue
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return defaultValue
  }
}

const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error)
    return false
  }
}

// ========== MEMBERS API ==========

// Get all members
app.get('/api/members', (req, res) => {
  try {
    const members = readJSON(membersFile, [])
    res.json(members)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add member
app.post('/api/members', (req, res) => {
  try {
    const { id, name, photo } = req.body
    const members = readJSON(membersFile, [])
    members.push({ id, name, photo: photo || null })
    writeJSON(membersFile, members)
    res.json({ success: true, id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update member
app.put('/api/members/:id', (req, res) => {
  try {
    const { id } = req.params
    const { name, photo } = req.body
    const members = readJSON(membersFile, [])
    const index = members.findIndex(m => m.id === id)
    if (index !== -1) {
      members[index] = { ...members[index], name, photo: photo || null }
      writeJSON(membersFile, members)
      res.json({ success: true })
    } else {
      res.status(404).json({ error: 'Member not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete member
app.delete('/api/members/:id', (req, res) => {
  try {
    const { id } = req.params
    const members = readJSON(membersFile, [])
    const filtered = members.filter(m => m.id !== id)
    writeJSON(membersFile, filtered)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== VOTES API ==========

// Get all votes
app.get('/api/votes', (req, res) => {
  try {
    const votes = readJSON(votesFile, [])
    res.json(votes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Submit vote
app.post('/api/votes', (req, res) => {
  try {
    const { voterName, scores } = req.body
    const voteId = Date.now().toString()
    const timestamp = new Date().toISOString()
    
    // Create vote object
    const vote = {
      id: voteId,
      voterName,
      timestamp,
      scores
    }
    
    // Save vote
    const votes = readJSON(votesFile, [])
    votes.push(vote)
    writeJSON(votesFile, votes)
    
    // Create and save logs
    const logs = readJSON(logsFile, [])
    const members = readJSON(membersFile, [])
    
    Object.keys(scores).forEach(memberId => {
      const score = scores[memberId]
      if (score > 0) {
        const member = members.find(m => m.id === memberId)
        const memberName = member ? member.name : 'Unknown'
        logs.push({
          voteId,
          voterName,
          memberId,
          memberName,
          score,
          timestamp
        })
      }
    })
    
    writeJSON(logsFile, logs)
    
    res.json({ success: true, id: voteId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get vote logs
app.get('/api/vote-logs', (req, res) => {
  try {
    const logs = readJSON(logsFile, [])
    // Return last 100 logs
    const recentLogs = logs.slice(-100).reverse()
    res.json(recentLogs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get vote logs by vote ID
app.get('/api/vote-logs/:voteId', (req, res) => {
  try {
    const { voteId } = req.params
    const logs = readJSON(logsFile, [])
    const voteLogs = logs.filter(log => log.voteId === voteId)
    res.json(voteLogs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== RESULTS API ==========

// Get results (top 3 only)
app.get('/api/results', (req, res) => {
  try {
    const members = readJSON(membersFile, [])
    const votes = readJSON(votesFile, [])
    
    // Calculate scores
    const scores = {}
    members.forEach(member => {
      scores[member.id] = 0
    })
    
    votes.forEach(vote => {
      Object.keys(vote.scores).forEach(memberId => {
        scores[memberId] = (scores[memberId] || 0) + vote.scores[memberId]
      })
    })
    
    // Create results array
    const results = members.map(member => ({
      ...member,
      totalScore: scores[member.id] || 0
    }))
    
    // Sort by score and get top 3
    results.sort((a, b) => b.totalScore - a.totalScore)
    const top3 = results.slice(0, 3)
    
    res.json({
      results: top3,
      totalVotes: votes.length
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Reset all votes
app.delete('/api/votes', (req, res) => {
  try {
    writeJSON(votesFile, [])
    writeJSON(logsFile, [])
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📁 Data stored in: ${dataDir}`)
})
