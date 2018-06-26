# Checkout PSP API documentation

## Checkout API

### General

Our payment processing service related documentation.

## How does it work?

<p class="tip">
If you have any feedback regarding how we could improve the documentation, [please file an issue on Github](https://github.com/CheckoutFinland/checkoutfinland.github.io/issues).
You can also ask for support by opening an issue on GitHub.
Thank you!
</p>


### Test credentials

Please note that not all payment methods support testing. The payment methods that support testing payments are enabled.

* Merchant Id (MERCHANT): `375917`
* Secret Key: `SAIPPUAKAUPPIAS`

### Response summary

General API http status codes and what to expect of them.

* 200 - OK - Everything worked as expected.
* 400 - Bad Request - The request was unacceptable, probably due to missing a required parameter.
* 401 - Unauthorized - Hmac calculation failed or Merchant has no access to this feature.
* 404 - Not Found - The requested resource doesn't exist.

### Headers and request signing

All the API calls need to be signed using HMAC and SHA512. HMAC is calculated from the http requests body payload using the signing secret. Header key's must be sorted alphabetically and included in hmac calculation.

* Merchant ID needs to be in `Checkout-Account`
* Algorithm needs to be in `Checkout-Algorithm` (sha256 or sha512)
* Calculated HMAC needs to be send in each request in http-header named `Checkout-Signature`
* Method header `Checkout-Method` needs to be set to `POST, GET OR DELETE`

So the signature is calculated from these values as in this example:

```
Checkout-Account:1234\n
Checkout-Algorithm:sha512\n
Checkout-Method:POST\n
REQUEST BODY
```

These are passed to hmac function which uses SHA512 algorithm. Carriage returns (\r) should not be used, only line feed (\n).

### Hmac example (node.js)

```javascript
const crypto = require('crypto');

const ACCOUNT = '375917';
const SECRET = 'SAIPPUAKAUPPIAS';

const headers = {
  'checkout-account': ACCOUNT,
  'checkout-algorithm': 'sha256',
  'checkout-method': 'POST'
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

const hmac = crypto
  .createHmac('sha256', SECRET)
  .update(hmacPayload)
  .digest('hex');

// Expected HMAC:
// 84b454005a4f087076ad86cee8b4a646b18982998de7221db57646743cda7b81
```

## Payments

Actions related to the payment object are mapped to `/payments` API endpoint.

The following illustrates how the user moves in the payment process.

![mermaid diagram here](images/flow.png)

### Create

`POST /payments` creates a new open payment, returns a list of available payment methods.

** Parameters **

field | info | description
--- | --- | ---
stamp | string | Unique identifier for the order
reference | string | Order reference
amount | integer | todo
currency | alpha3 | todo
language | alpha2 | todo
items | Item[] | todo
customer | Customer | todo
deliveryAddress | Address | todo
invoicingAddress | Address | todo
redirectUrls | callbackUrl | todo
callbackUrls | callbackUrl | todo


**Item**

field | type | example | description
--- | --- | --- | ---
unitPrice | string | 1000 | Each country's main unit, e.g. for euros use cents
units | string | 5 | Quantity, how many items ordered
productCode | string | 9a | Meta information
deliveryDate | string | 2019-12-31 | When is this item going to be delivered
description | string | Cat suits for adults | todo
category | string | fur suits | todo
stamp | string | d4aca017-f1e7-4fa5-bfb5-2906e141ebac | unique identifier for this item
reference | string | fur-suits-5 | todo

**Customer**

field | info | description
--- | --- | ---
email | string | john.doe@example.org | todo
firstName | string | John | todo
lastName | string | Doe | todo
phone | string | 358451031234 | todo
vatId | string | FI02454583 | todo

**Address**

field | info | example | description
--- | --- | --- | ---
streetAddress | string | Fake Street 123 | todo
postalCode | string | 00100 | todo
city | string | Luleå | todo
county | string | Norbotten | todo
country | string | Sweden | todo

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

### List

TODO

### Get

`GET /payments/{transactionId}`


## Merchants

Actions related to the merchant object are mapped to `/merchant` API endpoint.

### List providers

`GET /merchants/payment-providers` returns a list of available providers for the merchant.

Grouped into `mobile`, `bank`, `creditcard` and `credit` payment methods.

**Parameters**

`amount (integer, optional)` specify amount if you want to get providers for specific amount


### Lol

ejeasdkpoa adshuutista