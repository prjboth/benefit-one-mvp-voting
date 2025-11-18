// Example: Using Vercel KV for persistent storage
// Install: npm install @vercel/kv

import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  const { method } = req

  if (method === 'GET') {
    const members = await kv.get('members') || []
    return res.json(members)
  }

  if (method === 'POST') {
    const { id, name, photo } = req.body
    const members = (await kv.get('members')) || []
    members.push({ id, name, photo: photo || null })
    await kv.set('members', members)
    return res.json({ success: true, id })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end()
}

