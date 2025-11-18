import { getAdminPassword } from '../../server/kv-utils.js'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      const { password } = req.body
      
      if (!password) {
        return res.status(400).json({ error: 'Password is required' })
      }

      const correctPassword = await getAdminPassword()
      const isValid = password === correctPassword

      return res.json({ 
        valid: isValid,
        // Don't return the actual password
      })
    } catch (error) {
      console.error('Error in POST /api/admin-password/verify:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  res.setHeader('Allow', ['POST'])
  return res.status(405).end()
}

