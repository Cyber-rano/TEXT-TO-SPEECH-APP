resource "random_id" "bucket_id" {
  byte_length = 4
}

resource "random_id" "website_bucket_id" {
  byte_length = 4
}

resource "aws_s3_bucket" "tts_audio_bucket" {
  bucket = "tts-audio-bucket-${random_id.bucket_id.hex}"

  versioning {
    enabled = false
  }

  tags = {
    Name = "TTS Audio Bucket"
  }
}

# S3 bucket for hosting the React app
resource "aws_s3_bucket" "tts_website_bucket" {
  bucket = "tts-website-${random_id.website_bucket_id.hex}"

  tags = {
    Name = "TTS Website Bucket"
  }
}

# Configure the website bucket for static website hosting
resource "aws_s3_bucket_website_configuration" "tts_website" {
  bucket = aws_s3_bucket.tts_website_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# Configure CORS for the website bucket
resource "aws_s3_bucket_cors_configuration" "tts_website_cors" {
  bucket = aws_s3_bucket.tts_website_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Make the website bucket public for static website hosting
resource "aws_s3_bucket_public_access_block" "tts_website_pab" {
  bucket = aws_s3_bucket.tts_website_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Bucket policy to allow public read access
resource "aws_s3_bucket_policy" "tts_website_policy" {
  bucket = aws_s3_bucket.tts_website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.tts_website_bucket.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.tts_website_pab]
}
