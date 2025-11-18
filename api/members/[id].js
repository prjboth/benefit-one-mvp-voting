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
  const id = query.id || query.id
  
  console.log('Request method:', method)
  console.log('Request query:', query)
  console.log('Extracted id:', id)

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
      console.log('DELETE /api/members/:id - Received id:', id)
      
      if (!id) {
        return res.status(400).json({ error: 'Missing member id' })
      }
      
      const members = await getMembers()
      console.log(`Current members count: ${members.length}`)
      
      const beforeCount = members.length
      const filtered = members.filter(m => m.id !== id)
      const afterCount = filtered.length
      
      if (beforeCount === afterCount) {
        console.warn(`Member with id ${id} not found`)
        return res.status(404).json({ error: 'Member not found' })
      }
      
      console.log(`Filtered members: ${beforeCount} -> ${afterCount}`)
      
      try {
        await setMembers(filtered)
        console.log(`Member deleted successfully. New count: ${afterCount}`)
        return res.json({ success: true })
      } catch (writeError) {
        console.error('Failed to write members to KV:', writeError)
        console.error('Write error details:', writeError.message, writeError.stack)
        return res.status(500).json({ error: 'Failed to save changes: ' + writeError.message })
      }
    } catch (error) {
      console.error('Error in DELETE /api/members/:id:', error)
      console.error('Error stack:', error.stack)
      return res.status(500).json({ error: error.message || 'Internal server error' })
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  return res.status(405).end()
}
