<img src="images/checkout-logo-vaaka-RGB.png" alt="Checkout Finland Oy" style="width: 200px;">

## Checkout PSP API

You can find example payloads and responses for all the requests, as well as [code examples](#code-examples), here.

## Payments

### Create

#### Request body

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

#### Response

```json
{
  "transactionId": "80621392",
  "href": "https://api.checkout.fi/pay/80621392",
  "providers": [
    {
      "url": "https://api.checkout.fi/payments/80621392/pivo/redirect",
      "icon": "https://payment.checkout.fi/static/img/pivo_140x75.png",
      "svg": "https://payment.checkout.fi/static/img/payment-methods/pivo-siirto.svg",
      "name": "Pivo",
      "group": "mobile",
      "id": "pivo",
      "parameters": [
        {
          "name": "acquiring_id",
          "value": "checkout"
        },
        {
          "name": "amount",
          "value": "base64 MTUyNQ=="
        },
        {
          "name": "cancel_url",
          "value": "base64 aHR0cHM6Ly9hcGkuY2hlY2tvdXQuZmkvcGF5bWVudHMvODA2MjEzOTIvcGl2by9jYW5jZWw="
        },
        {
          "name": "merchant_business_id",
          "value": "base64 MTIzNDU2LTc="
        },
        {
          "name": "merchant_name",
          "value": "base64 VGVzdGkgT3k="
        },
        {
          "name": "reference",
          "value": "base64 ODA5NzU5MjQ4"
        },
        {
          "name": "reject_url",
          "value": "base64 aHR0cHM6Ly9hcGkuY2hlY2tvdXQuZmkvcGF5bWVudHMvODA2MjEzOTIvcGl2by9jYW5jZWw="
        },
        {
          "name": "return_url",
          "value": "base64 aHR0cHM6Ly9hcGkuY2hlY2tvdXQuZmkvcGF5bWVudHMvODA2MjEzOTIvcGl2by9zdWNjZXNz"
        },
        {
          "name": "stamp",
          "value": "base64 ODA5NzU5MjQ4"
        },
        {
          "name": "message",
          "value": "base64 Y2hlY2tvdXQubXljYXNoZmxvdy5maQ=="
        },
        {
          "name": "merchant_webstore_url",
          "value": "base64 aHR0cDovL2NoZWNrb3V0Lm15Y2FzaGZsb3cuZmk="
        },
        {
          "name": "signature",
          "value": "checkout_qa 86b43453732cf8aeb91b08dd42707fd6973819f4f23abffbfd27563f351d6b07"
        }
      ]
    },
    {
      "url": "https://api.checkout.fi/payments/80621392/masterpass/redirect",
      "icon": "https://payment.checkout.fi/static/img/masterpass_arrow_140x75.png",
      "svg": "https://payment.checkout.fi/static/img/payment-methods/masterpass.svg",
      "name": "Masterpass",
      "group": "mobile",
      "id": "masterpass",
      "parameters": [
        {
          "name": "sph-account",
          "value": "test"
        },
        {
          "name": "sph-merchant",
          "value": "test_merchantId"
        },
        {
          "name": "sph-api-version",
          "value": "20170627"
        },
        {
          "name": "sph-timestamp",
          "value": "2018-07-06T11:10:14Z"
        },
        {
          "name": "sph-request-id",
          "value": "00228f0f-85b3-433a-8071-b38e63a3b024"
        },
        {
          "name": "sph-amount",
          "value": "1525"
        },
        {
          "name": "sph-currency",
          "value": "EUR"
        },
        {
          "name": "sph-order",
          "value": "809759248"
        },
        {
          "name": "language",
          "value": "FI"
        },
        {
          "name": "description",
          "value": "checkout.mycashflow.fi"
        },
        {
          "name": "sph-success-url",
          "value": "https://api.checkout.fi/payments/80621392/masterpass/success"
        },
        {
          "name": "sph-cancel-url",
          "value": "https://api.checkout.fi/payments/80621392/masterpass/cancel"
        },
        {
          "name": "sph-failure-url",
          "value": "https://api.checkout.fi/payments/80621392/masterpass/failure"
        },
        {
          "name": "sph-webhook-success-url",
          "value": "https://api.checkout.fi/payments/80621392/masterpass/callback/success"
        },
        {
          "name": "sph-webhook-cancel-url",
          "value": "https://api.checkout.fi/payments/80621392/masterpass/callback/cancel"
        },
        {
          "name": "sph-webhook-failure-url",
          "value": "https://api.checkout.fi/payments/80621392/masterpass/callback/failure"
        },
        {
          "name": "sph-webhook-delay",
          "value": "60"
        },
        {
          "name": "signature",
          "value": "SPH1 testKey 17294419ee622be500d1acd654fde3b5462c0ea51d0a9285809d0856febeb81c"
        }
      ]
    }
  ]
}
```

### Get

#### Request

```
GET /payments/0fbda2ce-8115-11e8-a3c2-1b42d60c4148
checkout-account:375917
checkout-algorithm:sha256
checkout-method:GET
checkout-nonce:572119423466676
checkout-timestamp:2018-07-06T12:06:45.799Z
checkout-transaction-id:0fbda2ce-8115-11e8-a3c2-1b42d60c4148

```

#### Response

```json
{
  "id": "0fbda2ce-8115-11e8-a3c2-1b42d60c4148",
  "status": 1,
  "stamp": "572091345812938",
  "reference": "3759170",
  "amount": "1525"
}
```

### Refund

#### Request body

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

#### Response

```json
{
  "provider": "handelsbanken",
  "status": "ok",
  "transactionId": "258ad3a5-9711-44c3-be65-64a0ef462ba3"
}
```

## Code examples

### HMAC calculation (node.js)

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

// Expected HMAC: e6ed7ec0889db888f3067feb57e0a831b88da547902cd4f40ecb646d2bb763ac
const hmac = crypto
  .createHmac('sha256', SECRET)
  .update(hmacPayload)
  .digest('hex');
```

### HMAC calculation (PHP)

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
