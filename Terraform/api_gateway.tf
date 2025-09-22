resource "aws_apigatewayv2_api" "api_gateway" {
  name          = "tts-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [
      "http://127.0.0.1:5500",
      "http://tts-website-bce4c82c.s3-website-us-east-1.amazonaws.com",
      "https://tts-website-bce4c82c.s3-website-us-east-1.amazonaws.com",
      "http://localhost:3000",
      "https://localhost:3000"
    ]
    allow_methods = ["POST", "OPTIONS", "GET"]
    allow_headers = ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.api_gateway.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.tts_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "tts_route" {
  api_id    = aws_apigatewayv2_api.api_gateway.id
  route_key = "POST /tts"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "tts_options_route" {
  api_id    = aws_apigatewayv2_api.api_gateway.id
  route_key = "OPTIONS /tts"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "dev" {
  api_id      = aws_apigatewayv2_api.api_gateway.id
  name        = "dev"
  auto_deploy = true
}

resource "aws_lambda_permission" "apigw_lambda_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.tts_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api_gateway.execution_arn}/*/*"
}
