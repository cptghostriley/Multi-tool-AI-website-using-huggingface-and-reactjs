# Render deployment configuration

## For Web Service Deployment:

### Build Command:
```
cd server && npm install
```

### Start Command:
```
cd server && npm start
```

### Root Directory:
Leave blank (deploy from root)

### Environment Variables:
Add these in Render dashboard:
- NODE_ENV=production
- DATABASE_URL=your_neon_db_url
- JWT_SECRET=your_jwt_secret
- HUGGINGFACE_API_KEY=your_hf_key
- CLIENT_URL=your_frontend_url

### Auto-Deploy:
Yes (connect to GitHub repo)

## Alternative: Deploy server folder directly

### Root Directory:
server

### Build Command:
npm install

### Start Command:
npm start
