# Text-to-Speech React Application

A modern React application for text-to-speech conversion using AWS Lambda and Polly.

## Features

- Modern React 18 with functional components and hooks
- Responsive design with beautiful UI
- Real-time loading animations
- Error handling and user feedback
- Audio playback controls
- Mobile-friendly interface

## Project Structure

```
src/
├── components/
│   ├── TextToSpeech.js      # Main TTS component
│   └── TextToSpeech.css     # Component styles
├── App.js                   # Main app component
├── App.css                  # App styles
├── index.js                 # React entry point
└── index.css                # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- AWS CLI configured
- Terraform applied

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env file with your API URL
echo "REACT_APP_API_URL=https://your-api-id.execute-api.region.amazonaws.com/dev/tts" > .env
```

3. Start development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## Deployment

Use the provided deployment script:

```bash
# From the project root
./deploy_react.sh
```

This script will:
- Build the React application
- Upload it to the S3 bucket configured in Terraform
- Set proper content types for static files
- Provide the website URL

## Environment Variables

- `REACT_APP_API_URL`: The API Gateway URL for the TTS Lambda function

## Styling

The application uses:
- CSS modules for component-specific styles
- Google Fonts (Roboto)
- CSS Grid and Flexbox for layout
- CSS animations for loading states
- Responsive design principles

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
