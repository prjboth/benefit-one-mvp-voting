import { getMembers, setMembers } from '../../../server/kv-utils.js'

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

  if (method === 'PUT') {
    try {
      const { name, photo } = req.body
      const members = await getMembers()
      const index = members.findIndex(m => m.id === id)
      if (index !== -1) {
        members[index] = { ...members[index], name, photo: photo || null }
        await setMembers(members)
        return res.json({ success: true })
      }
      return res.status(404).json({ error: 'Member not found' })
    } catch (error) {
      console.error('Error in PUT /api/members/:id:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  if (method === 'DELETE') {
    try {
      const members = await getMembers()
      const filtered = members.filter(m => m.id !== id)
      await setMembers(filtered)
      return res.json({ success: true })
    } catch (error) {
      console.error('Error in DELETE /api/members/:id:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  return res.status(405).end()
}
