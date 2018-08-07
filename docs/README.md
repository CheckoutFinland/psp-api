<img src="images/checkout-logo-vaaka-RGB.png" alt="Checkout Finland Oy" style="width: 200px;">

## Checkout PSP API

If you are looking for our old [legacy API documentation, see this](https://checkoutfinland.github.io/legacy-api/).

### General

Documentation for our payment processing service.

<p class="tip">
If you have any feedback regarding how we could improve the documentation, [please file an issue on Github](https://github.com/CheckoutFinland/psp-api/issues).
You can also ask for support by opening an issue on GitHub.
Thank you!
</p>

### API Endpoint

* Our new API endpoint is `api.checkout.fi`

### Test credentials

Please note that not all payment methods support testing, so only the payment methods that support testing payments are enabled for these credentials.

* Merchant Id: `375917`
* Secret Key: `SAIPPUAKAUPPIAS`

### HTTP Response summary

General API HTTP status codes and what to expect of them.

Code | Text | Description
---- | ---- | -----------
200  | OK   | Everything worked as expected.
400  | Bad Request |The request was unacceptable, probably due to missing a required parameter.
401  | Unauthorized | HMAC calculation failed or Merchant has no access to this feature.
404  | Not Found | The requested resource doesn't exist.

### Headers and request signing

All API calls need to be signed using HMAC and SHA-256 or SHA-512.

All API responses are signed the same way allowing merchant to verify response validity. In addition the reponses contain `cof-request-id` header. Saving or logging the value of this header is recommended.

The signature is transmitted in `signature` HTTP header. Signature payload consists the following fields separated with a line feed (\n). Carrige returns (\r) should not be used.

* All `checkout-` headers in alphabetical order. The header keys must be in lowercase. Each header key and value are separated with `:`
* HTTP body, or empty string if no body

The headers are:

field | info | description
--- | --- | ---
checkout-account | numeric | Checkout account ID, eg. 375917
checkout-algorithm | string | Used signature algorithm, either sha256 or sha512
checkout-method | string | HTTP verb of request, either GET or POST
checkout-nonce | string | Unique identifier for this request
checkout-timestamp | string | ISO 8601 date time
checkout-transaction-id | string | Checkout transaction ID when accessing single transaction - not required for new payment request

The HTTP verb, nonce and timestamp are used to mitigate various replay and timing attacks. Below is an example of the payload passed to a HMAC function:

```
checkout-account:1234\n
checkout-algorithm:sha256\n
checkout-method:POST\n
checkout-nonce:1234\n
checkout-timestamp:2018-07-05T11:19:25.950Z\n
REQUEST BODY
```

See also code examples [HMAC calculation (node.js)](/examples#hmac-calculation-node-js) and [HMAC calculation (PHP)](/examples#hmac-calculation-php).

#### Redirect and callback URL signing

Return and callback URL parameters are signed as well, and the merchant *must* check signature validity. The signature is calculated the same way as for requests, but the values come in as query string parameters instead of headers. Empty string is used for the body.

## Payments

Actions related to the payment object are mapped to `/payments` API endpoint.

The following illustrates how the user moves in the payment process.

<div class='mermaid'>
sequenceDiagram

Client ->> Merchant: Proceed to checkout
Merchant ->> api.checkout.fi: Initiate new payment (POST /payments)
api.checkout.fi ->> Merchant: JSON with payment methods
Merchant ->> Client: Render payment method buttons
Client ->> Payment method provider: Submits chosen payment form
Payment method provider -->> Client: Redirect to Checkout success/cancel URL
Client -->> api.checkout.fi: success/cancel

opt Callback URL
  api.checkout.fi ->> Merchant: Call success/cancel callback URL
end

api.checkout.fi -->> Client: Redirect to Merchant success/cancel URL
Client ->> Merchant: Return to success/cancel
Merchant ->> Client: Render thank you -page
</div>

### Create

`HTTP POST /payments` creates a new open payment and returns a JSON object that includes the available payment methods. The merchant web shop renders HTML forms from the response objects (see [example](/examples#payment-provider-form-rendering)). The client browser will submit the form to the payment method provider.

Once the payment has been completed the client browser will return to the merchant provided redirect URL.

The request payload is described below, as well as the redirect and callback URL parameters. [JSON example payload and response](/examples?id=create) are available on the examples tab.

**Create Request Body**

field | info | description
----- | ---- | -----------
stamp | string | Unique identifier for the order
reference | string | Order reference
amount | integer | Total amount of the payment, in currency's minor units
currency | alpha3 | Currency, only EUR supported at the moment
language | alpha2 | Payment's language, currently supported are FI, SV, and EN
items | Item[] | Array of items
customer | Customer | Customer information
deliveryAddress | Address | Delivery address
invoicingAddress | Address | Invoicing address
redirectUrls | CallbackUrl | Where to redirect browser after a payment is paid or cancelled.
callbackUrls | CallbackUrl | Which url to ping after this payment is paid or cancelled

**Item**

field | type | example | description
----- | ---- | ------- | -----------
unitPrice | string | 1000 | Each country's minor unit, e.g. for euros use cents
units | string | 5 | Quantity, how many items ordered
productCode | string | 9a | Meta information
deliveryDate | string | 2019-12-31 | When is this item going to be delivered
description | string | Bear suits for adults | Item description
category | string | fur suits | Item category
stamp | string | d4aca017-f1e7-4fa5-bfb5-2906e141ebac | unique identifier for this item
reference | string | fur-suits-5 | Reference

**Customer**

field | info | example | description
----- | ---- | ------- | -----------
email | string | john.doe@example.org | Email
firstName | string | John | First name
lastName | string | Doe | Last name
phone | string | 358451031234 | Phone number
vatId | string | FI02454583 | VAT ID, if any

**Address**

field | info | example | description
----- | ---- | ------- | -----------
streetAddress | string | Fake Street 123 | Street address
postalCode | string | 00100 | Postal code
city | string | Luleå | City
county | string | Norbotten | County/State
country | string | Sweden | Country

**CallbackUrl**

These url's must use HTTPS.

field | info | example | description
----- | ---- | ------- | -----------
success | string | https://example.org/51/success | Called on successful payment
cancel | string | https://example.org/51/cancel | Called on cancelled payment

See [an example payload and response](/examples?id=create)

#### Redirect and callback URL parameters

Once the payment is complete, or cancelled, normally the client browser is redirected to the merchant provided URL. If merchant has provided a callback URL, it will be called too.

<p class="warning">
  The URLs may be called multiple times. Merchant web shop must be able to handle multiple requests.
</p>

The payment information is available in the query string parameters of the client request. For example, if the `redirectUrls.success` value was `https://example.org`, it would be accessed with parameters appended:

> https://example.org/51/success/return?checkout-account=375917&checkout-algorithm=sha256&checkout-amount=2964&checkout-stamp=15336332710015&checkout-reference=192387192837195&checkout-transaction-id=4b300af6-9a22-11e8-9184-abb6de7fd2d0&checkout-status=ok&checkout-provider=nordea&signature=b2d3ecdda2c04563a4638fcade3d4e77dfdc58829b429ad2c2cb422d0fc64080


The query string parameters are listed below. If callback URLs were provided, same parameters are used.

field | info |  description
----- | ---- |  -----------
checkout-account | numeric | Checkout account ID
checkout-algorithm | string | Used signature algorithm. The same as used by merchant when creating the payment.
checkout-amount | numeric | Payment amount in currency minor unit, eg. cents
checkout-stamp | string | Merchant provided stamp
checkout-reference | string | Merchant provided reference
checkout-transaction-id | string | Checkout provided transaction ID.<br><br>**Important:** Store the value. It is needed for other actions such as refund or payment information query
checkout-status | string | Payment status, either ok or fail
checkout-provider | string | The payment method provider the client used
signature | string | HMAC signature calculated from other parameter

Merchant must check that signature is valid. Signature is calculated as described [above](#redirect-and-callback-url-signing).

### Get

`HTTP GET /payments/{transactionId}` returns payment information.

### Refund

`HTTP POST /payments/{transactionId}/refund` refunds a payment by transaction ID.

**HTTP Request Body**

field | info | description
----- | ---- | -----------
amount | integer | Total amount to refund, in currency's minor units
items | RefundItem[] | Array of items to refund
callbackUrls | callbackUrl | Which url to server side after a payment is paid or cancelled

**RefundItem**

field | info | description
----- | ---- | -----------
amount | integer | Total amount to refund this item, in currency's minor units
stamp | string | Unique stamp of the refund item
callbackUrls | callbackUrl | Which urls to ping after the refund has been processed

An example payload:

```json
{
  "amount": 1590,
  "items": [
    {
      "amount": 1590,
      "stamp": 29858472952
    }
  ],
  "callbackUrls": {
    "success": "https://ecom.example.org/success",
    "cancel": "https://ecom.example.org/cancel"
  }
}
```


## Merchants

Actions related to the merchant object are mapped to the `/merchant` API endpoint.

### List providers

`HTTP GET /merchants/payment-providers` returns a list of available providers for the merchant, grouped into `mobile`, `bank`, `creditcard` and `credit` payment methods.

**HTTP GET query parameters**

field | info | example | description
----- | ---- | ------- | -----------
amount | integer, optional | 1000 | specify an amount to retrieve providers for a specific payment amount

Example
```
/merchants/payment-providers?amount=1000
```

## Upcoming features

* Token payments (Q4/2018)
* Settlement querying (Q4/2018)
* Asynchronous refunds (Q4/2018)


