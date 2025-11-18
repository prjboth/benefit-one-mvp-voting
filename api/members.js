import { readJSON, writeJSON } from '../server/utils.js'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { method } = req
  const membersFile = '/tmp/members.json'

  if (method === 'GET') {
    const members = readJSON(membersFile, [])
    return res.json(members)
  }

  if (method === 'POST') {
    const { id, name, photo } = req.body
    const members = readJSON(membersFile, [])
    members.push({ id, name, photo: photo || null })
    writeJSON(membersFile, members)
    return res.json({ success: true, id })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end()
}
