#!/bin/bash
set -e

echo "Packaging Lambda function..."
cd lambda
pip install -r requirements.txt -t .
zip -r ../lambda.zip .
cd ..
echo "Lambda package created: lambda.zip"
