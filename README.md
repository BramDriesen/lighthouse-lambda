# Lighthouse Lambda Function

This project aims to provide a deployable docker image that can be used with AWS Lambda.

## Allowed JSON body

- url: (required) The url to be checked
- preset: Determines how performance metrics are scored and if mobile-only audits are skipped. `mobile` or `desktop`. Defaults to `mobile`
- onlyCategories: Only run the specified categories. Available categories: accessibility, best-practices, performance, pwa, seo  [array]. Defaults to `["performance", "seo", "accessibility", "best-practices"]`

Example of a full request body

```json
{
    "url": "https://google.com",
    "preset": "desktop",
    "onlyCategories": ["seo"]
}
```

## Local development and testing

Ensure you have the `VS Code AWS Toolkit` and `aws-sam-cli` installed.

```bash
brew tap aws/tap
brew install aws-sam-cli
```

Run the debugging configuration to simulate the API Gateway with a request. To change parameters check the launch.json file.

Build and run the image

```bash
docker build --build-arg PRODUCTION=false -t lighthouse . && docker run -p 9000:8080 lighthouse
```

Testing the image (note that you can't fake an API gateway this way, you'll get an error that the JSON body is not defined)

```bash
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"url":"https://google.com"}'
```

## Copying an updated lock file from docker to host

```bash
docker cp f21e94db26da:/var/task/package-lock.json package-lock.json
```
