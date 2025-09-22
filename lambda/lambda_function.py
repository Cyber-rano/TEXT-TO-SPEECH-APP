import boto3
import os
import json
import uuid
import logging

# Logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS clients
polly = boto3.client("polly")
s3 = boto3.client("s3")

def lambda_handler(event, context):
    try:
        logger.info(f"Received event: {event}")

        # Handle CORS preflight requests
        if (event.get("httpMethod") == "OPTIONS" or 
            event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS" or
            event.get("requestContext", {}).get("routeKey") == "OPTIONS /tts"):
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
                    "Access-Control-Max-Age": "3600"
                },
                "body": ""
            }

        # Parse text from event
        text = event.get("text") or json.loads(event.get("body", "{}")).get("text")
        if not text:
            logger.error("No text provided")
            return {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                "body": json.dumps({"error": "No text provided"})
            }

        bucket = os.environ["S3_BUCKET"]
        file_name = f"{uuid.uuid4()}.mp3"
        audio_path = f"/tmp/{file_name}"

        # Generate speech
        polly_response = polly.synthesize_speech(
            Text=text,
            OutputFormat="mp3",
            VoiceId="Joanna"
        )

        # Save audio locally
        with open(audio_path, "wb") as f:
            f.write(polly_response["AudioStream"].read())

        # Upload to S3
        s3.upload_file(audio_path, bucket, file_name)

        # Generate pre-signed URL (valid 1 hour)
        audio_url = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": bucket, "Key": file_name},
            ExpiresIn=3600
        )

        logger.info(f"Pre-signed URL generated: {audio_url}")

        # Return pre-signed URL in 's3_url' key for compatibility
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Audio generated successfully", "s3_url": audio_url})
        }

    except Exception as e:
        logger.exception("Error generating speech")
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
                "Content-Type": "application/json"
            },
            "body": json.dumps({"error": str(e)})
        }

