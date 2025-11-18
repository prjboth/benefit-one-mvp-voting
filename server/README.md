# Backend Server

## Quick Start

```bash
# Install dependencies
npm install

# Run server
npm run dev    # Development (auto-reload)
npm start      # Production
```

Server runs on `http://localhost:3001`

## Data Storage

Data is stored in JSON files in `server/data/`:
- `members.json` - All members
- `votes.json` - All votes
- `logs.json` - Vote logs (who voted for whom with how many points)

## API Endpoints

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Add member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Votes
- `GET /api/votes` - Get all votes
- `POST /api/votes` - Submit vote
- `DELETE /api/votes` - Reset all votes

### Results
- `GET /api/results` - Get top 3 results

### Logs
- `GET /api/vote-logs` - Get all logs (last 100)
- `GET /api/vote-logs/:voteId` - Get logs for specific vote

