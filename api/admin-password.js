import { getAdminPassword, setAdminPassword } from '../server/kv-utils.js'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { method, body } = req

  if (method === 'GET') {
    try {
      // Don't return the actual password for security
      // Just return if password exists
      const password = await getAdminPassword()
      return res.json({ 
        exists: !!password,
        // For initial setup, we'll return a flag to check if it's default
        isDefault: password === '0909'
      })
    } catch (error) {
      console.error('Error in GET /api/admin-password:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  if (method === 'POST' || method === 'PUT') {
    try {
      const { currentPassword, newPassword } = body
      
      if (!newPassword) {
        return res.status(400).json({ error: 'New password is required' })
      }

      if (newPassword.length < 4) {
        return res.status(400).json({ error: 'Password must be at least 4 characters' })
      }

      // Verify current password if provided
      if (currentPassword) {
        const current = await getAdminPassword()
        if (currentPassword !== current) {
          return res.status(401).json({ error: 'Current password is incorrect' })
        }
      }

      // Set new password
      await setAdminPassword(newPassword)
      console.log('Admin password updated successfully')
      
      return res.json({ success: true, message: 'Password updated successfully' })
    } catch (error) {
      console.error('Error in POST/PUT /api/admin-password:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT'])
  return res.status(405).end()
}

