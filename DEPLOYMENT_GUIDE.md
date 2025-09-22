# Text-to-Speech React App Deployment Guide

This guide will help you deploy the React frontend to S3 and configure it as a fully functional website.

## Prerequisites

1. **AWS CLI** installed and configured
2. **Terraform** installed
3. **Node.js** (v14 or higher) installed
4. **npm** or **yarn** package manager

## Step 1: Apply Terraform Configuration

First, apply the Terraform configuration to create the S3 bucket for hosting:

```bash
cd Terraform
terraform init
terraform plan
terraform apply
```

This will create:
- A new S3 bucket for hosting the React app
- CORS configuration for the bucket
- Static website hosting configuration
- Public access policies

## Step 2: Deploy the React App

From the project root directory, run the deployment script:

```bash
./deploy_react.sh
```

This script will:
1. Get the S3 bucket name and API URL from Terraform outputs
2. Install React dependencies (if needed)
3. Create environment file with API URL
4. Build the React application
5. Upload the build files to S3
6. Set proper content types for static files
7. Provide the website URL

## Step 3: Access Your Website

After deployment, you'll get a website URL like:
```
http://tts-website-xxxxx.s3-website-region.amazonaws.com
```

You can also get the URL anytime by running:
```bash
cd Terraform
terraform output website_url
```

## Manual Deployment (Alternative)

If you prefer to deploy manually:

1. **Build the React app:**
```bash
cd Frontend
npm install
echo "REACT_APP_API_URL=https://your-api-id.execute-api.region.amazonaws.com/dev/tts" > .env
npm run build
```

2. **Upload to S3:**
```bash
aws s3 sync build/ s3://your-website-bucket-name/ --delete
```

3. **Set content types:**
```bash
aws s3 cp s3://your-website-bucket-name/index.html s3://your-website-bucket-name/index.html --content-type "text/html" --metadata-directive REPLACE
```

## Troubleshooting

### CORS Issues
If you encounter CORS issues:
1. Check that the S3 bucket CORS configuration is applied
2. Verify the API Gateway CORS settings
3. Ensure the API URL in the React app matches the actual API Gateway URL

### Build Issues
If the React build fails:
1. Check Node.js version (should be v14+)
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### S3 Upload Issues
If S3 upload fails:
1. Check AWS CLI configuration: `aws configure list`
2. Verify S3 bucket permissions
3. Check if the bucket exists: `aws s3 ls s3://your-bucket-name`

## Environment Variables

The React app uses these environment variables:
- `REACT_APP_API_URL`: The API Gateway URL for the TTS Lambda function

## File Structure

```
Frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── TextToSpeech.js
│   │   └── TextToSpeech.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── .env (created during deployment)
└── README.md
```

## Features

- **Modern React 18**: Uses functional components and hooks
- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Animated loading indicators
- **Error Handling**: User-friendly error messages
- **Audio Controls**: Built-in HTML5 audio player
- **CORS Support**: Properly configured for cross-origin requests

## Security Notes

- The S3 bucket is configured for public read access (required for static website hosting)
- CORS is configured to allow requests from any origin
- The API Gateway should have proper authentication if needed
- Consider using CloudFront for HTTPS and better performance in production

## Next Steps

1. **Custom Domain**: Set up a custom domain with Route 53
2. **HTTPS**: Use CloudFront with SSL certificate
3. **CDN**: Configure CloudFront for better performance
4. **Monitoring**: Set up CloudWatch alarms for the application
5. **CI/CD**: Set up automated deployment pipeline
