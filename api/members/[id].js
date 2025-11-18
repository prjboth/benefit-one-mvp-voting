import { readJSON, writeJSON } from '../../../server/utils.js'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { method, query } = req
  const { id } = query
  const membersFile = '/tmp/members.json'

  if (method === 'PUT') {
    const { name, photo } = req.body
    const members = readJSON(membersFile, [])
    const index = members.findIndex(m => m.id === id)
    if (index !== -1) {
      members[index] = { ...members[index], name, photo: photo || null }
      writeJSON(membersFile, members)
      return res.json({ success: true })
    }
    return res.status(404).json({ error: 'Member not found' })
  }

  if (method === 'DELETE') {
    const members = readJSON(membersFile, [])
    const filtered = members.filter(m => m.id !== id)
    writeJSON(membersFile, filtered)
    return res.json({ success: true })
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  return res.status(405).end()
}
