<img src="images/checkout-logo-vaaka-RGB.png" alt="Checkout Finland Oy" style="width: 200px;">

## Checkout PSP API

If you are looking for our old [legacy API documentation, see this](https://checkoutfinland.github.io/legacy-api/).

### General

Our payment processing service related documentation.

<p class="tip">
If you have any feedback regarding how we could improve the documentation, [please file an issue on Github](https://github.com/CheckoutFinland/checkoutfinland.github.io/issues).
You can also ask for support by opening an issue on GitHub.
Thank you!
</p>

### API Endpoint

* Our new API endpoint is `api.checkout.fi`

### Test credentials

Please note that not all payment methods support testing. The payment methods that support testing payments are enabled.

* Merchant Id (MERCHANT): `375917`
* Secret Key: `SAIPPUAKAUPPIAS`

### HTTP Response summary

General API http status codes and what to expect of them.

* 200 - OK - Everything worked as expected.
* 400 - Bad Request - The request was unacceptable, probably due to missing a required parameter.
* 401 - Unauthorized - Hmac calculation failed or Merchant has no access to this feature.
* 404 - Not Found - The requested resource doesn't exist.

### Headers and request signing

All the API calls need to be signed using HMAC and SHA256 or SHA512.

HMAC is calculated from the http requests body payload using the signing secret. Header key's must be sorted alphabetically and included in hmac calculation.

* Merchant ID needs to be in `Checkout-Account`
* Algorithm needs to be in `Checkout-Algorithm` (sha256 or sha512)
* Calculated HMAC needs to be send in each request in http-header named `Checkout-Signature`
* Method header `Checkout-Method` needs to be set to `POST, GET OR DELETE`

So the signature is calculated from these values as in this example:

```
checkout-account:1234\n
checkout-algorithm:sha512\n
checkout-method:POST\n
checkout-nonce:1234\n
checkout-timestamp:2018-07-05T11:19:25.950Z\n
REQUEST BODY
```

These are passed to hmac function which uses SHA512 algorithm. Carriage returns (\r) should not be used, only line feed (\n).


field | info | description
--- | --- | ---
checkout-account | numeric | Checkout account ID
checkout-algorithm | string | Used algorithm, either sha256 or sha512
checkout-method | string | HTTP verb of request
checkout-nonce | string | Unique identifier for this request
checkout-timestamp | string | ISO 8601 date time

The http verb, nonce and timestamp are used to mitigate various replay and timing attacks.

### Hmac example (node.js)

```javascript
const crypto = require('crypto');

const ACCOUNT = '375917';
const SECRET = 'SAIPPUAKAUPPIAS';

const headers = {
  'checkout-account': ACCOUNT,
  'checkout-algorithm': 'sha256',
  'checkout-method': 'POST',
  'checkout-nonce': '564635208570151',
  'checkout-timestamp': '2018-07-06T10:01:31.904Z'
};

const body = {
  stamp: 'should-be-unique-for-merchant',
  reference: '3759170',
  amount: 1525,
  currency: 'EUR',
  language:'FI',
  items: [
    {
      unitPrice: 1525,
      units: 1,
      vatPercentage: 24,
      productCode: '#1234',
      deliveryDate: '2018-09-01'
    }
  ],
  customer: {
    email: 'test.customer@example.com'
  },
  redirectUrls: {
    success: 'https://ecom.example.com/cart/success',
    cancel: 'https://ecom.example.com/cart/cancel'
  }
};

const hmacPayload =
  Object.keys(headers)
    .sort()
    .map((key) => [ key, headers[key] ].join(':'))
    .concat(JSON.stringify(body))
    .join("\n");

// Expected hmac: e6ed7ec0889db888f3067feb57e0a831b88da547902cd4f40ecb646d2bb763ac
const hmac = crypto
  .createHmac('sha256', SECRET)
  .update(hmacPayload)
  .digest('hex');
```


### Hmac example (php)

```php
<?php

$ACCOUNT = '375917';
$SECRET = 'SAIPPUAKAUPPIAS';

$headers = array(
    'checkout-account' => $ACCOUNT,
    'checkout-algorithm' => 'sha256',
    'checkout-method' => 'POST',
    'checkout-nonce' => '564635208570151',
    'checkout-timestamp' => '2018-07-06T10:01:31.904Z'
);

// Headers must be sorted alphabetically by their key
ksort($headers);

$body = array(
    'stamp' =>  'should-be-unique-for-merchant',
    'reference' => '3759170',
    'amount' => 1525,
    'currency' => 'EUR',
    'language' => 'FI',
    'items' => array(
        array(
            'unitPrice' => 1525,
            'units' => 1,
            'vatPercentage' => 24,
            'productCode' => '#1234',
            'deliveryDate' => '2018-09-01'
        )
    ),
    'customer' => array(
        'email' => 'test.customer@example.com'
    ),
    'redirectUrls' => array(
        'success' => 'https://ecom.example.com/cart/success',
        'cancel' => 'https://ecom.example.com/cart/cancel'
    )
);


$headers =
    array_map(
        function ($val, $key) {
            return $key . ':' . $val;
        },
        $headers,
        array_keys($headers)
    );

array_push($headers, json_encode($body, JSON_UNESCAPED_SLASHES));

// string(64) "e6ed7ec0889db888f3067feb57e0a831b88da547902cd4f40ecb646d2bb763ac"
$hmac = hash_hmac('sha256', join("\n", $headers), $SECRET);
```


## Payments

Actions related to the payment object are mapped to `/payments` API endpoint.

The following illustrates how the user moves in the payment process.

![mermaid flow chart, illustrating the payment process](images/flow.png)

### Create

`HTTP POST /payments` creates a new open payment, returns a list of available payment methods.

**HTTP Request body**

field | info | description
--- | --- | ---
stamp | string | Unique identifier for the order
reference | string | Order reference
amount | integer | Total amount of the payment, in currency's minor units
currency | alpha3 | Currency, only EUR supported at the moment
language | alpha2 | Payment's language
items | Item[] | Array of items
customer | Customer | Customer information
deliveryAddress | Address | Delivery address
invoicingAddress | Address | Invoicing address
redirectUrls | callbackUrl | Where to redirect browser after a payment is paid or cancelled
callbackUrls | callbackUrl | Which url to ping after this payment is paid or cancelled

**Item**

field | type | example | description
--- | --- | --- | ---
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
--- | --- | ---
email | string | john.doe@example.org | Email
firstName | string | John | First name
lastName | string | Doe | Last name
phone | string | 358451031234 | Phone number
vatId | string | FI02454583 | VAT ID, if any

**Address**

field | info | example | description
--- | --- | --- | ---
streetAddress | string | Fake Street 123 | Street address
postalCode | string | 00100 | Postal code
city | string | Luleå | City
county | string | Norbotten | County/State
country | string | Sweden | Country

An example payload
```json
{
  "stamp": 29858472952,
  "reference": 9187445,
  "amount": 1590,
  "currency": "EUR",
  "language": "FI",
  "items": [
    {
      "unitPrice": 1590,
      "units": 1,
      "vatPercentage": 24,
      "productCode": "#927502759",
      "deliveryDate": "2018-03-07",
      "description": "Cat ladder",
      "category": "shoe",
      "merchant": 375917,
      "stamp": 29858472952,
      "reference": 9187445,
      "commission": {
        "merchant": "string",
        "amount": 0
      }
    }
  ],
  "customer": {
    "email": "john.doe@example.org",
    "firstName": "John",
    "lastName": "Doe",
    "phone": 358501234567,
    "vatId": "FI02454583"
  },
  "deliveryAddress": {
    "streetAddress": "Fake street 123",
    "postalCode": "00100",
    "city": "Luleå",
    "county": "Norrbotten",
    "country": "Sweden"
  },
  "invoicingAddress": {
    "streetAddress": "Fake street 123",
    "postalCode": "00100",
    "city": "Luleå",
    "county": "Norrbotten",
    "country": "Sweden"
  },
  "redirectUrls": {
    "success": "https://ecom.example.org/success",
    "cancel": "https://ecom.example.org/cancel"
  },
  "callbackUrls": {
    "success": "https://ecom.example.org/success",
    "cancel": "https://ecom.example.org/cancel"
  }
}
```

### Get

`HTTP GET /payments/{transactionId}` returns the payment information

### Refund

`HTTP POST /payments/{transactionId}/refund` refund a payment by transaction ID.

**HTTP Request body**

field | info | description
--- | --- | ---
amount | integer | Total amount to refund, in currency's minor units
items | RefundItem[] | Array of items to refund
callbackUrls | callbackUrl | Which url to server side after a payment is paid or cancelled

**RefundItem**

field | info | description
--- | --- | ---
amount | integer | Total amount to refund this item, in currency's minor units
stamp | string | Unique stamp of the refund item
callbackUrls | callbackUrl | Which urls to ping after the refund has been processed

An example payload
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

Actions related to the merchant object are mapped to `/merchant` API endpoint.

### List providers

`HTTP GET /merchants/payment-providers` returns a list of available providers for the merchant.

Grouped into `mobile`, `bank`, `creditcard` and `credit` payment methods.

**HTTP GET query parameters**

`amount (integer, optional)` specify amount if you want to get providers for specific amount. 

Example
```
/merchants/payment-providers?amount=1000
```

## Upcoming features

* Token payments (Q4/2018)
* Settlement querying (Q4/2018)
* Asynchronous refunds (Q4/2018)

 
