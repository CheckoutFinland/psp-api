# Checkout beta API documentation

## Developing locally

```bash
npm install docute-cli
npx docute -p 8080 docs
```

## Run Swagger UI locally

```bash
docker run -p 80:8080 -e SWAGGER_JSON=/docs/checkout-psp-api.yaml -v /path/to/psp-api/docs:/docs swaggerapi/swagger-ui
open http://localhost:80/
```
