output "api_invoke_url" {
  description = "Base URL of the API Gateway for the TTS project"
  value       = aws_apigatewayv2_stage.dev.invoke_url
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.tts_audio_bucket.bucket
  description = "The S3 bucket used to store generated audio files"
}

output "website_url" {
  value       = "http://${aws_s3_bucket_website_configuration.tts_website.website_endpoint}"
  description = "The URL of the hosted React application"
}

output "website_bucket_name" {
  value       = aws_s3_bucket.tts_website_bucket.bucket
  description = "The S3 bucket used to host the React application"
}