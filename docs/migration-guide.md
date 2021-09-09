<img src="images/checkout-logo-vaaka-RGB.png" alt="Checkout Finland Oy" style="width: 200px;">

# Migration guide

## Why upgrade?

Checkout Finland has been [acquired by Paytrail](https://www.nets.eu/Media-and-press/news/Pages/Nets-Group-completes-acquisition-of-e-commerce-provider-Checkout-Finland.aspx).

Paytrail will release new Payment API in the fall of 2021 and it will be based on Checkout Finland's current PSP API, which this documentation describes. 

<p class="tip">
**You can use this documentation to plan and build the integration to the new Paytrail Payment API, which will be nearly identical.** Only minor things, like the address of the service, will change upon release.
</p>

### Migrating from Paytrail E2 Interface

The new Paytrail Payment API will replace all legacy Paytrail integrations, including E2 Interface. Old Paytrail interfaces will be shutting down gradually and go offline completely in the summer of 2022.

The new API offers a lot of improvements, including but not limited to:

- Better performance, reliability and scalability
- More payment methods
  - [Apple Pay](#apple-pay)
  - [Card Tokenization](#token-payments)
- Server-to-server callbacks for more reliable webshop integration
- Developer friendly APIs
- Beautiful, accessible, and mobile friendly hosted payment wall and landing pages

## Changes in the new API

The new Payment API is completely different from the legacy E2 Interface. We've listed some of the key differences here for easier migration.

### Payment initialization

- Legacy E2 Interface payments were initiated with a form data POST to `https://payment.paytrail.com/e2`
  - Merchant authentication info in the payment payload
  - Signature calculation with form values in specific order joined with  `|` (pipe) character
  - Response is a HTTP redirect to hosted payment gateway
  - Payment API issued payment ID was an integer
  - Payload for Sales Channel payments completely different from normal payment
  - Error replies were HTML pages with limited information on how to fix the problem

- New Payment API payments are initialized with a JSON POST to `https://api.checkout.fi/payments`
  - Merchant [authentication info in headers](/#headers-and-request-signing)
  - Signature calculation payload includes headers in alphabetical order and the full body payload
  - HMAC signed [JSON response](/#response)
    - SVG icons provided
    - Payment methods have a group attribute which allows easy grouping for improved user experience
  - No support for redirect, JSON document contains URL to hosted payment gateway, i.e. payments must be initialized with a server-to-server call.
  - Payment API transaction IDs are UUIDs and are used e.g. for refunds or payment status queries
  - Swedish payments use correct language code (SV)
  - Payload for Sales Channel (shop-in-shop) payments pretty much the same as for normal payments
  - Correct HTTP status codes and understandable error replies in JSON format

### Payment confirmation

- Legacy E2 Interface returned the client browser back to webshop with payment confirmation data in query string and on successful payment sent a notify call to webshop
  - Payment status is either `PAID` or `CANCELLED` 

- New Payment API does client browser redirects too, but offers an option to define callback URLs
  - [Callback URLs](/#create-request-body) are server-to-server calls and can be delayed
  - Callback URLs ensure that payment is registered also to the shop even if client browser does not return. Callback URLs are used also with providers supporting them which means that e.g. credit card payments are always registered to shop regardless of what client browser does
  - Human readable [payment statuses](/#statuses)
  - Used payment method [is reported to shop too](/#redirect-and-callback-url-parameters)

### Refund

- Legacy E2 Interface refund was done with a POST request to `https://api.paytrail.com/merchant/v1/payments/{orderNumber}/refund`
  - Headers contained MD5 encoded signature
  - JSON response

- New API refunds are done with a JSON POST to `https://api.checkout.fi/payments/{transactionId}/refund`
  - Refund API supports [callback URLs too](/#http-request-body)
  - HMAC signed [JSON response](/#response2)

### Status API

- In legacy E2 Interface querying payment status was done with GET request to `https://api.paytrail.com/merchant/v1/payments?order_number={orderNumber}`
  - Merchant defined order number used for locating the payment
  - JSON response with status and payment method ID

- New status API is called with GET to `https://api.checkout.fi/payments/{transactionId}`
  - Payment API issued [transaction ID used](/#get)
  - HMAC signed [JSON response](/#response1) with more information than just the status

## New endpoints

- [Payment provider listing](/#list-providers) endpoint
  - Allows displaying available payment methods without actually initializing a new payment
- [Payment reporting](/#payment-reports) endpoints
- [Settlement listing](/#settlements) endpoints
