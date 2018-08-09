const lol = {
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
};

const responseToHtml = (response) =>
  response.providers
    .map((provider) =>`
        <form method='POST' action=${provider.url}>
            ${provider.parameters.map((param) =>`<input type='hidden' name='${param.name}' value='${param.value}' />`)}
            <button><img src='${provider.svg}' /></button>
        </form>`
    )
    .join('\n');

console.log(responseToHtml(lol));
