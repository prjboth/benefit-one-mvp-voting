import { getMembers, setMembers } from '../server/kv-utils.js'

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

  if (method === 'GET') {
    try {
      const members = await getMembers()
      return res.json(members)
    } catch (error) {
      console.error('Error in GET /api/members:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  if (method === 'POST') {
    try {
      const { id, name, photo } = req.body
      console.log('POST /api/members - Received:', { id, name, photo: photo ? 'has photo' : 'no photo' })
      
      if (!id || !name) {
        return res.status(400).json({ error: 'Missing id or name' })
      }
      
      const members = await getMembers()
      console.log(`Current members count: ${members.length}`)
      
      members.push({ id, name, photo: photo || null })
      const writeSuccess = await setMembers(members)
      
      if (!writeSuccess) {
        console.error('Failed to write members to KV')
        return res.status(500).json({ error: 'Failed to save member' })
      }
      
      console.log(`Member added successfully. New count: ${members.length}`)
      return res.json({ success: true, id })
    } catch (error) {
      console.error('Error in POST /api/members:', error)
      console.error('Error stack:', error.stack)
      return res.status(500).json({ error: error.message || 'Internal server error' })
    }
  }

  if (method === 'DELETE') {
    try {
      // DELETE with id in query string: /api/members?id=xxx
      const { id } = query
      console.log('DELETE /api/members - Received id:', id)
      
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
      console.error('Error in DELETE /api/members:', error)
      console.error('Error stack:', error.stack)
      return res.status(500).json({ error: error.message || 'Internal server error' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
  return res.status(405).end()
}
