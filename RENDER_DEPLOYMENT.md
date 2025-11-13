# Deploying to Render

This guide will help you deploy your Renewable Energy Dashboard application to Render.

## Prerequisites

1. A [Render account](https://render.com/) (free tier is available)
2. Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Create a PostgreSQL Database

1. Log in to your Render dashboard
2. Click **New +** → **PostgreSQL**
3. Configure your database:
   - **Name**: `renewable-energy-db` (or any name you prefer)
   - **Database**: `renewable_energy`
   - **User**: `renewable_user` (or any username you prefer)
   - **Region**: Choose the region closest to your users
   - **Plan**: Free (or paid plan for production)
4. Click **Create Database**
5. Wait for the database to be created
6. Copy the **External Database URL** (you'll need this later)

### 2. Create a Web Service

1. From the Render dashboard, click **New +** → **Web Service**
2. Connect your Git repository
3. Configure your web service:

   **Basic Settings:**
   - **Name**: `renewable-energy-dashboard` (or any name you prefer)
   - **Region**: Same region as your database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave blank (unless your code is in a subdirectory)
   - **Runtime**: `Node`

   **Build Settings:**
   - **Build Command**: `npm install && npm run build && npm run db:push`
   - **Start Command**: `npm start`

   **Environment Variables:**
   Click **Add Environment Variable** and add:
   - **Key**: `NODE_ENV`  
     **Value**: `production`
   - **Key**: `DATABASE_URL`  
     **Value**: Paste the External Database URL you copied earlier
   - **Key**: `PORT`  
     **Value**: `5000`

4. Click **Create Web Service**

### 3. Seed the Database (Optional)

After your web service is deployed for the first time, you can seed the database with sample data:

1. Go to your web service in the Render dashboard
2. Click on the **Shell** tab
3. Run the following command:
   ```bash
   npm run db:seed
   ```
   
   Or using the seed script directly:
   ```bash
   tsx server/seed.ts
   ```

### 4. Access Your Application

Once deployment is complete:
1. Your app will be available at `https://your-service-name.onrender.com`
2. The deployment typically takes 5-10 minutes
3. You can view deployment logs in the **Logs** tab

## Important Notes

### Database Connection
- The application automatically detects the `DATABASE_URL` environment variable
- If `DATABASE_URL` is present, it uses PostgreSQL storage
- If not present, it falls back to in-memory storage (not recommended for production)

### Environment Variables
Make sure all environment variables are set correctly in Render:
- `NODE_ENV=production`
- `DATABASE_URL` (from your PostgreSQL database)
- `PORT=5000` (Render automatically sets this, but it's good to specify)

### Build Command
The build command does three things:
1. `npm install` - Installs dependencies
2. `npm run build` - Builds the frontend (React/Vite) and backend (Express)
3. `npm run db:push` - Pushes database schema to PostgreSQL

### Start Command
- `npm start` runs `NODE_ENV=production node dist/index.js`
- This serves both the API and static frontend files

## Troubleshooting

### Build Failures
If the build fails:
1. Check the build logs in Render
2. Make sure all dependencies are in `package.json`
3. Verify that `DATABASE_URL` is set correctly

### Database Connection Errors
If you see database connection errors:
1. Verify the `DATABASE_URL` is correct
2. Check that your database is in the same region as your web service
3. Make sure the database is running (green status in Render dashboard)

### Application Not Loading
If the app doesn't load:
1. Check the service logs for errors
2. Verify the `PORT` environment variable is set to `5000`
3. Make sure the build completed successfully

## Alternative: Using render.yaml

Alternatively, you can use the included `render.yaml` file for automated deployment:

1. Push your code to your Git repository
2. In Render dashboard, click **New +** → **Blueprint**
3. Connect your repository
4. Render will automatically detect `render.yaml` and create:
   - PostgreSQL database
   - Web service with proper configuration
5. Click **Apply** to deploy

The `render.yaml` file contains all the configuration needed for deployment.

## Manual Configuration (render.yaml approach)

If you prefer infrastructure as code, use the included `render.yaml` file. This file defines:

```yaml
services:
  - type: web
    name: renewable-energy-dashboard
    runtime: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: renewable-energy-db
          property: connectionString

databases:
  - name: renewable-energy-db
    databaseName: renewable_energy
    user: renewable_user
```

## Next Steps

After deployment:
1. Seed your database with initial data (if not done already)
2. Test all features of your application
3. Set up custom domain (optional, available in Render settings)
4. Configure monitoring and alerts (optional)

## Cost Considerations

- **Free Tier**: Includes 750 hours of web service and 90 days of PostgreSQL
- **Paid Plans**: Start at $7/month for web services and $7/month for PostgreSQL
- Free tier services spin down after 15 minutes of inactivity and take ~30 seconds to restart

For production applications, consider using paid plans for better performance and reliability.
