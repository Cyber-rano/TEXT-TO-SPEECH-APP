# TEXT-TO-SPEECH-APP

A **serverless text-to-speech application** built with AWS services. It converts text to speech making it easy for student and language learners and to help content creators convert blogs into podcast

Link: http://tts-website-bce4c82c.s3-website-us-east-1.amazonaws.com/
---

## 🏗️ Architecture Overview

<img width="926" height="530" alt="TTS Architecture" src="architecture img/Screenshot 2025-09-18 124122.png" />  


<img width="926" height="530" alt="TTS Architecture" src="architecture img/Screenshot 2025-09-18 124320.png" />  

**Architecture Component:**

1. **User Interface (UI)** The frontend of the application is where the user input text to generate the speech
2. **API Gateway** This exposess RESTful APIs to handle user requests
3. **Lambda Function** Processes the incoming requests, interact with **Amazon Polly**, and reyurns the audio URL
4. **Amazon Polly** converts the provides text into speech using the selected voice.
5. **Amazon S3** Stores the generated audio files
6. **IAM Roles** Grants the necessary permissions for Lambda to interact with others AWS services.

---

## 🛠️ AWS Services

### Core Services

| Service         | Resource    | Purpose                            |
| --------------- | ----------- | ---------------------------------- |
| **S3**          | 1 Buckets   | Frontend hosting & audio storage   |
| **Lambda**      | 1 Function  | Text-to-speech processing          |
| **API Gateway** | HTTP API    | RESTful API endpoint               |
| **Polly**       | TTS Service | Speech synthesis                   |


## 📁 Project Structure

```
terraform-tts-deployment/
├── main.tf              # Core infrastructure
├── monitoring.tf        # Logging & monitoring setup
├── dashboard.tf         # CloudWatch dashboard
├── variables.tf         # Configuration variables
├── outputs.tf           # Resource outputs
├── index.html           # Frontend application
├── lambda/
│   ├── tts_lambda.py    # Lambda function code
│   └── tts_lambda.zip   # Deployment package
├── deploy-monitoring.bat # Deployment script
└── README.md            # Documentation
```

---

## ⚡ Deployment Guide

### Prerequisites

* AWS CLI configured
* Terraform v1.5+
* Python 3.11+

### Steps

1. **Clone & Configure**

   ```bash
   git clone <your-repo-url>
   cd terraform-tts-app
   ```

2. **Update Variables**

   ```hcl
   variable "alert_email" {
     default = "email"  
   }
   ```

3. **Deploy Core Infrastructure**

   ```bash
   terraform init
   terraform plan
   terraform validate
   terraform apply
   ```
   ```
---

### Limits

* Max input: **5000 characters**
* Warning at 4500+ characters
* MP3 output, 7-day retention, 1-hour Presigned URLs

---

## 🌥️ Roadmap for Future Improvement 
Future Improvements

**CloudFront (or Amplify)**

Add Amazon CloudFront in front of S3 for global content delivery with low latency.

Alternative: AWS Amplify for frontend hosting + CI/CD pipeline.

**SSML Support for Polly**

Enhance speech generation with Speech Synthesis Markup Language (SSML).

Allows control over pauses, emphasis, pitch, and pronunciation.

**Conversion History**

Extend DynamoDB schema to keep a full history of conversions per user.

Build a UI component so users can view, replay, and re-download past audio files.

**Audio Sharing Links**

Generate shareable Presigned URLs with configurable expiry times.

Optionally integrate CloudFront Signed URLs for global sharing with better performance.

### Security Enhancements

* [ ] API rate limiting
* [ ] AWS WAF integration
* [ ] VPC endpoints for private traffic
* [ ] IAM key rotation policy

### Performance Improvements

* [ ] Add CloudFront CDN
* [ ] Enable Lambda provisioned concurrency
* [ ] Use S3 Transfer Acceleration
* [ ] Add Redis caching layer

### Feature Additions

* [ ] Session Timeout
* [ ] Audio output types (Speaker, headphone, bluetooth)
* [x] Multi-Country Voices 
* [ ] Auto-Regeneration 
* [ ] SSML support
* [ ] Real-Time Voice cloning
* [ ] Batch processing
* [ ] Audio effects (speed, pitch, volume) 
* [ ] Conversion history
* [ ] Audio sharing links

---

## 💰 Cost Optimization

### Current Estimates

* **Lambda**: \~\$0.20 / 1M requests
* **API Gateway**: \~\$1.00 / 1M requests
* **S3**: \~\$0.023 / GB / month
* **Polly**: \~\$4.00 / 1M characters
* **CloudWatch**: \~\$0.50 / GB logs

### Recommendations

* Enable **S3 Intelligent Tiering**
* Optimize **Lambda memory allocation**
* Use **request caching** in API Gateway
* Set up **billing alerts**

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

---

---

## 🙏 Acknowledgments

* AWS Documentation & Sample Code
* Terraform AWS Provider
* Amazon Polly Voice Samples
* Amazon Q

---
