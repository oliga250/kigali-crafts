# Railway Deployment Fix Summary

## Problem
The Railway deployment was failing with:
```
npm error code ENOENT
npm error syscall open
npm error path /app/package.json
npm error errno -2
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/app/package.json'
```

This happened because Railway was trying to run `npm install --production` in the root `/app` directory, but this project is a monorepo with separate `frontend/` and `backend/` directories, each containing their own package.json.

## Solution Implemented

### 1. Created railway.json
Added a Railway configuration file to define both services:
```json
{
  "services": [
    {
      "name": "backend",
      "source": {
        "path": "backend",
        "dockerfile": "backend/Dockerfile"
      }
    },
    {
      "name": "frontend",
      "source": {
        "path": "frontend",
        "dockerfile": "frontend/Dockerfile"
      }
    }
  ]
}
```

### 2. Fixed Frontend Dockerfile
- **Before**: `COPY package.json ./` (missing package-lock.json)
- **After**: `COPY package*.json ./` (includes both package.json and package-lock.json)
- Added nginx configuration with environment variable support:
  - `ENV BACKEND_URL=http://backend:5000`
  - `RUN apk add --no-cache gettext` (for envsubst)
  - `COPY nginx.conf /etc/nginx/conf.d/default.conf.template`
  - `CMD envsubst '\$BACKEND_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g "daemon off;"`

### 3. Fixed Backend Dockerfile
- **Before**: `RUN npm install` (development dependencies included)
- **After**: `RUN npm install --omit=dev` (production-only dependencies, modern equivalent of --production)

### 4. Updated Frontend nginx.conf
Changed from hardcoded proxy:
```nginx
proxy_pass http://backend:5000;
```
To environment variable:
```nginx
proxy_pass ${BACKEND_URL};
```

## How It Works
1. Railway reads railway.json and identifies two services: frontend and backend
2. For each service, Railway:
   - Changes to the specified path (./frontend or ./backend)
   - Uses the specified Dockerfile
   - Builds the container using that Dockerfile
3. The frontend service can now communicate with the backend service using the BACKEND_URL environment variable (which Railway will set automatically based on service networking)
4. Both Dockerfiles now properly copy package*.json to leverage Docker caching and ensure deterministic builds

## Files Modified
- `railway.json` (new)
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `backend/Dockerfile`

## Next Steps
1. Commit these changes to your repository
2. Redeploy to Railway
3. Railway should now detect the railway.json and build both services separately
4. The frontend will be available on its assigned domain
5. The backend will be available on its assigned domain
6. The frontend will automatically communicate with the backend via the BACKEND_URL environment variable