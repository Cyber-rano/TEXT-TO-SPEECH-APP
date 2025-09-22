
# Text-to-Speech AWS Application

A full-stack solution for converting text to speech using AWS Lambda, API Gateway, S3, and a modern React frontend.

## Overview

This project enables users to input text and receive audio output using AWS services. The backend is powered by a Python Lambda function, exposed via API Gateway, and the frontend is a responsive React app deployed to S3.

## Architecture

<p align="center">
  <img src="architecture/image.png" alt="App Screenshot" width="700"/>
</p>
 

- **Frontend**: React 18 app with functional components, hooks, and responsive design.
- **Backend**: Python Lambda function for text-to-speech conversion.
- **API Gateway**: Provides RESTful endpoints for the frontend to interact with Lambda.
- **S3**: Hosts the React app and stores generated audio files.
- **Terraform**: Manages AWS infrastructure as code.

## Features

- Text-to-speech conversion via AWS Lambda & Polly
- Modern React UI with loading states and error handling
- Audio playback controls
- Mobile-friendly and responsive design
- CORS support for cross-origin requests
- Automated deployment scripts

## Project Structure

```
Frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── TextToSpeech.js
│   │   └── TextToSpeech.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── .env
└── README.md

lambda/
├── lambda_function.py
├── requirements.txt
└── six.py

Terraform/
├── api_gateway.tf
├── lambda.tf
└── ...
```

## Getting Started

### Prerequisites

- AWS CLI configured
- Terraform installed
- Node.js (v14+)
- npm or yarn

### Setup & Deployment

1. **Provision AWS resources:**
   ```bash
   cd Terraform
   terraform init
   terraform apply
   ```
2. **Deploy the React app:**
   ```bash
   ./deploy_react.sh
   ```
   This script will:
   - Build the React app
   - Upload to S3
   - Set environment variables
   - Output the website URL

3. **Access your site:**
   - The deployment script will display the S3 website URL.
   - You can also run:
     ```bash
     cd Terraform
     terraform output website_url
     ```

## Environment Variables

- `REACT_APP_API_URL`: The API Gateway endpoint for Lambda (auto-generated during deployment).

## Troubleshooting

- **CORS Issues**: Check S3 bucket and API Gateway CORS settings.
- **Build Issues**: Ensure Node.js version is v14+, clear npm cache, reinstall dependencies.
- **S3 Upload Issues**: Verify AWS CLI config and S3 bucket permissions.

## Security Notes

- Do not expose sensitive AWS credentials.
- Restrict S3 bucket and Lambda permissions as needed.

## Next Steps

- Add authentication (e.g., Cognito)
- Monitor Lambda usage and costs
- Extend frontend features

---

For more details, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).