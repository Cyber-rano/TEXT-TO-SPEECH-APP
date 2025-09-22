#!/bin/bash

# Deploy React app to S3
# This script builds the React app and uploads it to the S3 bucket

set -e

echo "🚀 Starting React app deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first."
    exit 1
fi

# Get the website bucket name from Terraform output
echo "📋 Getting S3 bucket name from Terraform..."
cd Terraform
WEBSITE_BUCKET=$(terraform output -raw website_bucket_name)
API_URL=$(terraform output -raw api_invoke_url)
cd ..

if [ -z "$WEBSITE_BUCKET" ]; then
    echo "❌ Could not get website bucket name from Terraform. Make sure Terraform is applied."
    exit 1
fi

echo "📦 Website bucket: $WEBSITE_BUCKET"
echo "🔗 API URL: $API_URL"

# Navigate to Frontend directory
cd Frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📥 Installing React dependencies..."
    npm install
fi

# Create .env file with API URL
echo "⚙️  Creating environment file..."
cat > .env << EOF
REACT_APP_API_URL=$API_URL
EOF

# Build the React app
echo "🔨 Building React app..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed. No build directory found."
    exit 1
fi

# Upload to S3
echo "☁️  Uploading to S3..."
aws s3 sync build/ s3://$WEBSITE_BUCKET/ --delete

# Set proper content types
echo "🔧 Setting content types..."
aws s3 cp s3://$WEBSITE_BUCKET/index.html s3://$WEBSITE_BUCKET/index.html --content-type "text/html" --metadata-directive REPLACE
aws s3 cp s3://$WEBSITE_BUCKET/static/ s3://$WEBSITE_BUCKET/static/ --recursive --content-type "application/javascript" --metadata-directive REPLACE

echo "✅ Deployment completed successfully!"

# Get the correct region for the website URL
REGION=$(aws s3api get-bucket-location --bucket $WEBSITE_BUCKET --query 'LocationConstraint' --output text)
if [ "$REGION" = "None" ] || [ -z "$REGION" ]; then
    REGION="us-east-1"
fi

echo "🌐 Website URL: http://$WEBSITE_BUCKET.s3-website-$REGION.amazonaws.com"
echo "🔗 You can also get the URL anytime with: cd Terraform && terraform output website_url"

cd ..
