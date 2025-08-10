# TensorFinance Advisor Deployment Guide

This guide will help you deploy your TensorFinance Advisor application correctly to avoid CORS issues.

## Backend Deployment (Render)

1. **Push your changes to GitHub**

   ```
   git add .
   git commit -m "Fixed CORS issues for production"
   git push
   ```

2. **Update Render Configuration**

   - Log in to your Render dashboard
   - Navigate to your TensorFinance Advisor backend service
   - Under the "Environment" tab, add these environment variables:
     - `NODE_ENV`: `production`

3. **Deploy the Latest Version**

   - Click "Manual Deploy" > "Deploy latest commit"
   - Wait for the deployment to complete

4. **Verify Backend Deployment**
   - Test the health endpoint: `https://tensorfinance-advisor.onrender.com/health`
   - It should return a JSON response with status "UP"

## Frontend Deployment (Vercel)

1. **Update Environment Variables in Vercel**

   - Log in to your Vercel dashboard
   - Navigate to your TensorFinance Advisor project
   - Go to "Settings" > "Environment Variables"
   - Add or update:
     - `VITE_API_URL`: `https://tensorfinance-advisor.onrender.com`

2. **Redeploy Frontend**

   - Go to the "Deployments" tab
   - Click "Redeploy" on your latest deployment

3. **Verify Frontend Deployment**
   - Open your Vercel deployment URL: `https://tensor-finance-advisor.vercel.app`
   - Test the application by entering an income amount
   - Check browser console for any CORS errors

## Troubleshooting CORS Issues

If you still encounter CORS errors:

1. **Check Backend Logs**

   - In Render dashboard, view the logs for your backend service
   - Look for any messages about blocked origins

2. **Verify Network Requests**

   - In browser developer tools, go to the Network tab
   - Look for the `/api/train` request
   - Check if it has the proper headers:
     - Response should include `Access-Control-Allow-Origin`

3. **Test with the CORS Script**

   - Run the test-cors.js script locally:

   ```
   node test-cors.js
   ```

4. **Temporary CORS Fix**
   - If issues persist, consider using a CORS proxy service like [cors-anywhere](https://github.com/Rob--W/cors-anywhere/)
   - Or install a browser extension that disables CORS for testing

## Additional Resources

- [Render CORS Documentation](https://render.com/docs/cors)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Understanding CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
