# TEXT-TO-SPEECH-APP
A serverless app that converts text to speech 

---

# 🎤 AWS Text-to-Speech (TTS) Application

A **scalable, serverless text-to-speech application** built with AWS services. It provides secure user authentication, real-time speech synthesis, and comprehensive monitoring using AWS best practices.

Link: http://my-tts-website-terraform.s3-website.us-east-2.amazonaws.com/
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

### Monitoring & Logging

| Service        | Resource   | Purpose                             |
| -------------- | ---------- | ----------------------------------- |
| **CloudWatch** | Log Groups | Capture Lambda & API Gateway logs   |
| **CloudWatch** | 4 Alarms   | Monitor errors, latency, duration   |
| **CloudWatch** | Dashboard  | Centralized metrics visualization   |
| **SNS**        | Topic      | Email alerts for system issues      |
| **X-Ray**      | Tracing    | Performance and dependency analysis |

---

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

4. **Deploy Monitoring (Optional)**

   ```bash
   # Windows
   deploy-monitoring.bat

   # Linux/Mac
   terraform apply -var="alert_email=maryakussah123@gmail.com"
   ```

5. **Upload Frontend**

   ```bash
   aws s3 cp index.html s3://my-tts-website-terraform/
   ```

---

## 📊 Monitoring & Alerts

* **CloudWatch Alarms**:

  * Lambda error rate >5%
  * Lambda duration >10s
  * API 4XX >10/5min
  * API 5XX (any occurrence)

* **Log Groups**:

  * `/aws/lambda/PollyTTSLambda`
  * `/aws/apigateway/PollyTTSAPI`

* **Dashboards**:

  * Lambda: invocations, errors, duration
  * API Gateway: requests, latency, errors

---

## 🔧 Configuration

### Voice Options

```javascript
const voices = {
  US: ['Joanna', 'Matthew', 'Ivy', 'Justin', 'Salli', 'Kimberly', 'Joey'],
  UK: ['Amy', 'Brian', 'Emma'],
  AU: ['Russell', 'Nicole', 'Olivia'],
  IN: ['Raveena', 'Aditi']
};
```

### Session Management

* Auto-logout after 10 minutes
* Monitors mouse, keyboard, touch, scroll events
* Silent logout → redirect to login

### Limits

* Max input: **3000 characters**
* Warning at 2500+ characters
* MP3 output, 7-day retention, 1-hour Presigned URLs

---

## 🎯 Roadmap
🔮 Planned Improvements

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

* [x] Session Timeout ✅
* [x] Multi-Country Voices ✅
* [x] Auto-Regeneration ✅
* [ ] SSML support
* [ ] Voice cloning
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

## 🐛 Troubleshooting

**Authentication Errors**

```bash
aws cognito-idp describe-user-pool --user-pool-id <pool-id>
```

**Lambda Timeouts**

```bash
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda"
```

**S3 Upload Issues**

```bash
aws s3api get-bucket-policy --bucket my-tts-website-terraform
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

* AWS Documentation & Sample Code
* Terraform AWS Provider
* Bootstrap CSS Framework
* Amazon Polly Voice Samples
* Amazon Q

---

✨ If you find this project useful, please **star ⭐ the repo** to support development!

---
