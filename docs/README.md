<img src="images/checkout-logo-vaaka-RGB.png" alt="Checkout Finland Oy" style="width: 200px;">

# Checkout PSP API

This is the API reference and example documentation for [Checkout Finland](https://checkout.fi/) - a Payment Service Provider with
which ecommerce merchants can accept payments mobile and online.

OpenAPI 3 specification for the API is also [available for download](checkout-psp-api.yaml).

<p class="tip">
If you have any feedback regarding how we could improve the documentation, [please file an issue on Github](https://github.com/CheckoutFinland/psp-api/issues).
You can also ask for support by opening an issue on GitHub.
Thank you!
</p>

If you are looking for the [legacy API documentation, see this](https://checkoutfinland.github.io/legacy-api/).

## API endpoint

* API endpoint is `api.checkout.fi`

## Test credentials

Please note that not all payment methods support testing, so only the payment methods that support testing payments are enabled for these credentials. Provider specific credentials for approving payments can be found from [providers tab](/payment-method-providers#test-credentials). Payments created with test accounts will be removed daily which means older payments cannot be refunded.

### Normal merchant account

* Merchant ID: `375917`
* Secret key: `SAIPPUAKAUPPIAS`

### Shop-in-Shop merchant account

*Note:* Use these only if you are setting up a [Shop-in-Shop](https://checkout.fi/verkkokauppiaalle/palvelu/shop-in-shop/) web shop.

* Aggregate merchant ID: `695861`
* Aggregate secret key: `MONISAIPPUAKAUPPIAS`
* Shop-in-Shop merchant ID: `695874`

## HTTP response summary

General API HTTP status codes and what to expect of them.

Code | Text | Description
---- | ---- | -----------
200  | OK   | Everything worked as expected.
201  | Created | A payment/refund was created successfully.
400  | Bad Request |The request was unacceptable, probably due to missing a required parameter.
401  | Unauthorized | HMAC calculation failed or Merchant has no access to this feature.
404  | Not Found | The requested resource doesn't exist.
422  | Unprocessable Entity | The requested method is not supported.

## Headers and request signing

All API calls need to be signed using HMAC and SHA-256 or SHA-512. When a request contains a body, the body must be valid JSON and a `content-type` header with the value `application/json; charset=utf-8` must be included.

All API responses are signed the same way, allowing merchant to verify response validity. In addition, the reponses contain `cof-request-id` header. Saving or logging the value of this header is recommended.

The signature is transmitted in the `signature` HTTP header. Signature payload consists of the following fields separated with a line feed (\n). Carrige returns (\r) are not supported.

* All `checkout-` headers in alphabetical order. The header keys must be in lowercase. Each header key and value are separated with `:`
* HTTP body, or empty string if no body

The headers are:

field | info | description
--- | --- | ---
`checkout-account` | numeric | Checkout account ID, eg. 375917
`checkout-algorithm` | string | Used signature algorithm, either `sha256` or `sha512`
`checkout-method` | string | HTTP verb of the request, either `GET` or `POST`
`checkout-nonce` | string | Unique identifier for this request
`checkout-timestamp` | string | ISO 8601 date time
`checkout-transaction-id` | string | Checkout transaction ID when accessing single transaction - not required for a new payment request

The HTTP verb, nonce and timestamp are used to mitigate various replay and timing attacks. Below is an example payload passed to a HMAC function:

```
checkout-account:1234\n
checkout-algorithm:sha256\n
checkout-method:POST\n
checkout-nonce:1234\n
checkout-timestamp:2018-07-05T11:19:25.950Z\n
REQUEST BODY
```

See also code examples of [HMAC calculation in node.js](/examples#hmac-calculation-node-js) and [HMAC calculation in PHP](/examples#hmac-calculation-php).

#### For plugin developers

In addition to headers included in HMAC calculation `cof-plugin-version` header can be provided. This is optional, but highly recommended for customer service and debugging reasons.

### Redirect and callback URL signing

Return and callback URL parameters are also signed, and the merchant *must* check the signature validity. The signature is calculated the same way as for requests, but the values come in as query string parameters instead of headers. Empty string is used for the body.

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

The request payload is described below, as well as the redirect and callback URL parameters. [JSON example payload and response](/examples#create) are available on the examples tab.

[List providers](#list-providers) endpoint can be used to receive available payment methods without opening a new payment.

#### Create request body

field | info | required | description
----- | ---- | -------- | -----------
stamp | string | <center>x</center> | Merchant unique identifier for the order
reference | string | <center>x</center> | Order reference
amount | integer | <center>x</center> | Total amount of the payment in currency's minor units, eg. for Euros use cents. Must match the total sum of items.
currency | alpha3 | <center>x</center> | Currency, only `EUR` supported at the moment
language | alpha2 | <center>x</center> | Payment's language, currently supported are `FI`, `SV`, and `EN`
orderId | string | <center>-</center> | Order ID. Used for eg. Collector payments order ID. If not given, merchant reference is used instead.
items | [Item](#item)[] | <center>x</center> | Array of items
customer | [Customer](#customer) | <center>x</center> | Customer information
deliveryAddress | [Address](#address) | <center>-</center> | Delivery address
invoicingAddress | [Address](#address) | <center>-</center> | Invoicing address
redirectUrls | [CallbackUrl](#callbackurl) | <center>x</center> | Where to redirect browser after a payment is paid or cancelled.
callbackUrls | [CallbackUrl](#callbackurl) | <center>-</center> | Which url to ping after this payment is paid or cancelled
callbackDelay | number | <center>-</center> | Callback URL polling delay in seconds. If callback URLs are given, the call can be delayed up to 900 seconds. Default: 0

##### Item

field | type | required | example | description
----- | ---- | -------- | ------- | -----------
unitPrice | integer | <center>x</center> | 1000 | Price per unit, VAT included, in each country's minor unit, e.g. for Euros use cents
units | integer | <center>x</center> | 5 | Quantity, how many items ordered
vatPercentage | integer | <center>x</center> | 24 | VAT percentage
productCode | string | <center>x</center> | 9a | Merchant product code. May appear on invoices of certain payment methods.
deliveryDate | string | <center>x</center> | 2019-12-31 | When is this item going to be delivered
description | string | <center>-</center> | Bear suits for adults | Item description. May appear on invoices of certain payment methods.
category | string | <center>-</center> | fur suits | Merchant specific item category
orderId | string |  <center>-</center> |  | Item level order ID (suborder ID). Mainly useful for Shop-in-Shop purchases.
stamp | string | <center>-</center> | d4aca017-f1e7-4fa5-bfb5-2906e141ebac | Unique identifier for this item. Required for Shop-in-Shop payments.
reference | string | <center>-</center> | fur-suits-5 | Reference for this item. Required for Shop-in-Shop payments.
merchant | string | <center>-</center> | 695874 | Merchant ID for the item. Required for Shop-in-Shop payments, do not use for normal payments.
commission | [Commission](#commission) | <center>-</center> | - | Shop-in-Shop commission. Do not use for normal payments.

##### Customer

field | type | required | example | description
----- | ---- | -------- | ------- | -----------
email | string | <center>x</center> | john.doe@example.org | Email
firstName | string | <center>-</center> | John | First name
lastName | string | <center>-</center> | Doe | Last name
phone | string | <center>-</center> | 358451031234 | Phone number
vatId | string | <center>-</center> | FI02454583 | VAT ID, if any

##### Address

field | type | required | example | description
----- | ---- | -------- | ------- | -----------
streetAddress | string | <center>x</center> | Fake Street 123 | Street address
postalCode | string | <center>x</center> | 00100 | Postal code
city | string | <center>x</center> | Luleå | City
county | string | <center>-</center> | Norbotten | County/State
country | string | <center>x</center> | SE | Alpha-2 country code

##### CallbackUrl

These URLs must use HTTPS.

field | type | required | example | description
----- | ---- | -------- | ------- | -----------
success | string | <center>x</center> | https://example.org/51/success | Called on successful payment
cancel | string | <center>x</center> | https://example.org/51/cancel | Called on cancelled payment

##### Commission

field | type | required | example | description
----- | ---- | -------- | ------- | -----------
merchant | string | <center>x</center> | 695874 | Merchant who gets the commission
amount | integer | <center>x</center> | 250 | Amount of commission in currency's minor units, eg. for Euros use cents. VAT not applicable.

See [an example payload and response](/examples#create)

#### Response

The response JSON object contains the transaction ID of the payment and list of provider forms. It is highly recommended to render the icons and forms in the shop, but if this is not possible the response also contains a link to the hosted payment gateway. The response contains also HMAC verification headers and `cof-request-id` header. Storing or logging the request ID header is advised for possible debug needs.

field | type | description
------|------|------------
transactionId | string | Assigned transaction ID for the payment
href | string | URL to hosted payment gateway. Redirect (`HTTP GET`) user here if the payment forms cannot be rendered directly inside the web shop.
providers | [Provider](#provider) | Array of providers. Render these elements as HTML forms

##### Provider

Each provider describes a HTML form which the customer browser submits when performing the payment. Rendering the forms embedded in the web shop is the preferred way for the payment flow.

field | type | description
------|------|------------
url | string | Form target URL. Use `POST` as method.
icon | string | URL to PNG version of the provider icon
svg | string | URL to SVG version of the provider icon. Using the SVG icon is preferred.
group | string | Provider group. Provider groups allow presenting same type of providers in separate groups which usually makes it easier for the customer to select a payment method. Groups are: `mobile`, `bank`, `creditcard`, `credit`, and `other`.
name | string | Name of the provider.
parameters | [FormField](#formfield) | Array of form fields

##### FormField

The form field values are rendered as hidden `<input>` elements in the form. See form rendering [example](/examples#payment-provider-form-rendering)

field | type | description
------|------|------------
name | string | Name of the input
value | string | Value of the input

#### Redirect and callback URL parameters

Once the payment is complete, or cancelled, the client browser is normally redirected to the merchant provided URL. If merchant has provided a callback URL, it will be called too. The callback is called with `HTTP GET` and with the same query string parameters as in the redirect. The callback URL should respond with `HTTP 20x`.

<p class="warning">
  The URLs may be called multiple times. The merchant web shop must be able to handle multiple requests for the same purchase.
</p>

The payment information is available in the query string parameters of the client request. For example, if the `redirectUrls.success` value was `https://example.org`, it would be accessed with parameters appended:

> https://example.org/51/success/return?checkout-account=375917&checkout-algorithm=sha256&checkout-amount=2964&checkout-stamp=15336332710015&checkout-reference=192387192837195&checkout-transaction-id=4b300af6-9a22-11e8-9184-abb6de7fd2d0&checkout-status=ok&checkout-provider=nordea&signature=b2d3ecdda2c04563a4638fcade3d4e77dfdc58829b429ad2c2cb422d0fc64080


The query string parameters are listed below. If callback URLs were provided, same parameters are used.

field | info |  description
----- | ---- |  -----------
`checkout-account` | numeric | Checkout account ID
`checkout-algorithm` | string | Used signature algorithm. The same as used by merchant when creating the payment.
`checkout-amount` | numeric | Payment amount in currency minor unit, eg. cents
`checkout-stamp` | string | Merchant provided stamp
`checkout-reference` | string | Merchant provided reference
`checkout-transaction-id` | string | Checkout provided transaction ID.<br><br>**Important:** Store the value. It is needed for other actions such as refund or payment information query
`checkout-status` | string | Payment status, either `ok`, `pending`, `delayed`, or `fail`. See [statuses](#statuses) section for more information.
`checkout-provider` | string | The payment method provider the client used. Current values are documented on [providers tab](/payment-method-providers#test-credentials). The values are subject to change without notice.
`signature` | string | HMAC signature calculated from other parameter

Merchant must check that signature is valid. Signature is calculated as described [above](#redirect-and-callback-url-signing). **Do not** implement the HMAC validation with hardcoded query string parameters since new ones may be added later. Instead, filter parameters by name (include all that begin with `checkout-`), then sort, and calculate the HMAC.

##### Statuses

The currently possible payment statuses are:

status | description
-------|------------
`ok` | Payment was accepted by the provider and confirmed successfully
`fail` | Payment was cancelled by the user or rejected by the provider
`pending` | Payment was initially approved by the provider but further processing is needed. `pending` payments are reported as either `ok` or `fail` via callbacks, if provided, and using the redirect URLs.
`delayed` | A rare status related to a single payment method that is not generally enabled. May take days to complete. If completed, will be reported as `ok` via the callback *or* the redirect URL. This can be handled the same way as `pending`.


### Get

`HTTP GET /payments/{transactionId}` returns payment information.

Get transaction info. Payments are reported primarily via callbacks, and implementations should mainly rely on receiving the info via them. All received payments will be eventually reported.

#### Response

field | type | description
------|------|------------
transactionId | string | Assigned transaction ID for the payment
status | string | `new`, `ok`, `fail`, `pending`, or `delayed`. `new` is for transactions that have been created but nothing further has happened. Other statuses are desribed [above](#statuses).
amount | integer | Total amount of the payment in currency's minor units, eg. for Euros use cents
currency | alpha3 | Currency
stamp | string | Merchant unique identifier for the order
reference | string | Order reference
createdAt | string | Transaction creation timestamp
href | string | If transaction is in status `new`, link to the hosted payment gateway
provider | string | If processed, the name of the payment method provider
filingCode | string | If paid, the filing code issued by the payment method provider
paidAt | string | Timestamp when the transaction was paid

See [example response](/examples#get) from examples tab.

### Refund

`HTTP POST /payments/{transactionId}/refund` refunds a payment by transaction ID.

<p class="tip">
  Asynchronous refunds are planned for later implementation. It is advised that integrating partners implement refunds with this in mind, as it will be the primary method for refunds later.
  Technically this means that when a refund request is accepted, an OK response is sent to the caller. Later, when the refund is processed, the callback will be called with the actual outcome.
</p>

#### HTTP request body

field | type | required | description
----- | ---- | -------- | -----------
amount | integer | <center>-/x</center> | Total amount to refund, in currency's minor units (ie. EUR cents). Required for normal payment refunds. Shop-in-Shop payments can be refunded to full amount by giving the full payment amount here without items.
email | string | <center>-</center> | Refund recipient email address. Some payment methods [do not support API refunds](/payment-method-providers#refunds), and some have refund related limitations. If email address is given, email refund will be executed as a fallback method if API refund is unsuccessful, or as the default method if the provider does not support API refunds.
refundStamp | string | <center>-</center> |  Merchant unique identifier for the refund
refundReference | string | <center>-</center> | Refund reference
items | [RefundItem](#refunditem)[] | <center>-</center> | Array of items to refund. Use only for Shop-in-Shop payments.
callbackUrls | [CallbackUrl](#callbackurl) | <center>x</center> | Which urls to ping after the refund has been processed. The callback is called with `HTTP GET` and with the same query string parameters as in the [payment request callback](#redirect-and-callback-url-parameters). The server should respond with `HTTP 20x`.

##### RefundItem

field | type | required | description
----- | ---- | ---------| -----------
amount | integer | <center>x</center> | Total amount to refund this item, in currency's minor units (ie. EUR cents)
stamp | string | <center>x</center> | The item unique identifier
refundStamp | string | <center>-</center> |  Merchant unique identifier for the refund
refundReference | string | <center>-</center> | Refund reference
commission | [RefundCommission](#RefundCommission) | <center>-</center> | Shop-in-Shop commission return. In refunds, the given amount is returned from the given commission account to the item merchant account.

##### RefundCommission

field | type | required | example | description
----- | ---- | -------- | ------- | -----------
merchant | string | <center>x</center> | 695874 | Merchant from whom the commission is returned to the submerchant.
amount | integer | <center>x</center> | 250 | Amount of commission in currency's minor units, eg. for Euros use cents. VAT not applicable.

See [an example payload and response](/examples#refund)

#### Response

Status code | Explanation
------------|------------
201 | Refund created successfully
400 | Something went wrong
422 | Used payment method provider does not support refunds

Note, that at the moment HTTP 400 may occur also for 3rd party reasons - eg. bacause Nordea test API does not support refunds. See all provider limitations from [providers tab](/payment-method-providers#refunds).

## Payment Reports

Checkout provides an API for asynchronous payment report generation. A merchant can view their payments in this report. A call to the endpoint must contain a callback URL where the payment report will be delivered to once it has been generated.

The endpoint supports specifying whether the result will be delivered as a JSON payload or as a CSV file. It also supports field filtering and some result filtering.

A Shop-in-Shop aggregate merchant can also fetch its submerchant's payment report.

### Payment report request

`HTTP POST /payments/report` results in a callback containing the payment report.

field | info | required | default | description
----- | ---- | -------- | ------- | -----------
requestType | string | <center>x</center> | | In which format will the response be delivered in, currently supported are `json` and `csv`.
callbackUrl | string | <center>x</center> | | The url the system will send the report to as a `POST` request.
paymentStatus | string | <center></center> | `default` | How are the payments statuses filtered. `default` includes both paid and settled payments, `paid` includes paid payments that have not been settled yet, `all` includes everything, for example unpaid or failed payments and `settled` only includes settled payments.
startDate | string | <center></center> | | Only trades created after this datetime will be included in the report. Expects date as `ISO` format.
endDate | string | <center></center> | | Only trades created before this datetime will be included in the report. Expects date as `ISO` format.
limit | integer | <center></center> | `50000` | Limit the amount of payments included in the report. Maximum 50000.
reportFields | string[] | <center></center> | all | Limit the fields that will be included in the report. Leaving this empty will include all fields. Possible values: `entryDate`,`created`,`amount`,`status`,`firstname`,`familyname`,`description`,`reference`,`paymentMethod`,`stamp`,`address`,`postcode`,`postoffice`,`country`,`checkoutReference`,`archiveNumber`,`payerName`,`settlementId`,`settlementDate`,`originalTradeReference`,`vatPercentage`,`vatAmount`,`paymentMethodFee`,`paymentMethodCommission`,`shopInShopCommission`,`shopInShopCommissionVatPercentage` and `shopInShopCommissionVatAmount`
submerchant | integer | <center></center> | | Get submerchant's payment report (aggregate only)

#### Response

Status code | Explanation
------------|------------
200 | Payment report generation initiated successfully
400 | Something went wrong

#### Callback example

```json
[ { entryDate: '19-06-2019',
    created: '22:41',
    amount: 25.55,
    status: 'Paid',
    firstname: 'Mikko',
    familyname: 'Mallikas',
    description: 'Webshop test payment',
    reference: '12345-545454',
    paymentMethod: 'Osuuspankki',
    stamp: '11-1560973275',
    address: 'Mallikkaankatu 1',
    postcode: '33100',
    postoffice: 'Tampere',
    country: 'Suomi',
    checkoutReference: '1255939828',
    archiveNumber: '201906195937310000',
    payerName: 'MALLIKASMIK',
    originalTradeReference: null,
    vatPercentage: 24,
    vatAmount: 6.132
    paymentMethodFee: 0.12,
    paymentMethodCommission: 0.024,
    settlementId: 123456,
    settlementDate: '31-06-2019',
    shopInShopCommission: 0.8,
    shopInShopCommissionVatPercentage: 24,
    shopInShopCommissionVatAmount: 0.192 } ]
```

### Payment report request by settlement ID

`HTTP POST /settlements/:id/payments/report` results in a callback containing the payment report.

field | info | required | default | description
----- | ---- | -------- | ------- | -----------
requestType | string | <center>x</center> | | In which format will the response be delivered in, currently supported are `json` and `csv`.
callbackUrl | string | <center>x</center> | | The url the system will send the report to as a `POST` request. Callback URLs must use HTTPS.
reportFields | string[] | <center></center> | all | Limit the fields that will be included in the report. Leaving this empty will include all fields. Possible values: `created`, `amount`, `status`, `firstname`, `familyname`, `description`, `reference`, `paymentMethod`, `stamp`, `address`, `postcode`, `postoffice`, `country`, `checkoutReference`, `archiveNumber`, `settlementId`, `settlementDate`, `refundAmount`, `fee` and `provision`.
submerchant | integer | <center></center> | | Get submerchant's payment report (aggregate only)

#### Response

Status code | Explanation
------------|------------
200 | Payment report generation initiated successfully
400 | Something went wrong

## Settlements

`HTTP GET /settlements` returns merchant's settlement IDs. Maximum of 100 settlement IDs are returned, starting from the most recent settelements. The endpoint supports the following `query`-parameters:

field | required | description
----- | -------- | -----------
startDate | <center></center> | Only settlements created after on on this date will be included in the response. Must follow the following format: `YYYY-MM-DD`.
endDate | <center></center> | Only settlements created before or on this date will be included in the response. Must follow the following format: `YYYY-MM-DD`.
bankReference | <center></center> | Only include settlements that were settled with this bank reference.
limit | <center></center> | Limit the number of settlement IDs returned. `Limit 1` will only include the most recent settlement.
submerchant | <center></center> | Get submerchant's payment report (aggregate only)

Example
```
/settlements?bankReference=kissa&startDate=2019-01-01&endDate=2019-02-01
```

#### Response

Status code | Explanation
------------|------------
200 | Settlement IDs fetched successfully
400 | Something went wrong

## Merchants

Actions related to the merchant object are mapped to the `/merchant` API endpoint.

### List providers

`HTTP GET /merchants/payment-providers` returns a list of available providers for the merchant, grouped into `mobile`, `bank`, `creditcard`, `credit`, and `other` payment methods. This endpoint can be used for example to show available payment methods in checkout without initializing a new payment before the user actually proceeds to pay their order.

#### HTTP GET query parameters

field | info | example | description
----- | ---- | ------- | -----------
amount | integer, optional | 1000 | Purchase amount in currency's minor unit. Some payment methods have minimum or maximum purchase limits. When the amount is provided, only the methods suitable for the amount are returned. Otherwise, all merchant's payment methods are returned.

Example
```
/merchants/payment-providers?amount=1000
```
