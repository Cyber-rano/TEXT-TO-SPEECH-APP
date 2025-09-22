variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "lambda_function_name" {
  description = "Lambda function name"
  type        = string
  default     = "textToSpeechLambda"
}

variable "s3_bucket_prefix" {
  description = "Prefix for the S3 bucket name"
  type        = string
  default     = "tts-audio-output"
}
