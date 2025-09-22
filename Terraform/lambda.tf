resource "aws_lambda_function" "tts_lambda" {
  function_name = "textToSpeechLambda"
  runtime       = "python3.12"
  handler       = "lambda_function.lambda_handler"
  role          = aws_iam_role.lambda_exec_role.arn
  filename      = "../lambda_function.zip"

  environment {
    variables = {
      S3_BUCKET = aws_s3_bucket.tts_audio_bucket.bucket
    }
  }
}
