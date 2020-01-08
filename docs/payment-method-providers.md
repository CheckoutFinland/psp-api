<img src="images/checkout-logo-vaaka-RGB.png" alt="Checkout Finland Oy" style="width: 200px;">

# Payment method providers

The payment methods that can be tested without real money transactions have been enabled for the test accounts. Test credentials for the services can be found below.

## Test credentials

`checkout-provider` values are provided too, but they are subject to change without notice.

Provider | `checkout-provider` | Credentials
---------| --------------------| -------------
Masterpass | `masterpass` |  Use *IE English* Masterpass wallet and one of the [provided credit cards](https://developer.mastercard.com/page/masterpass-sandbox-testing-guidelines)
MobilePay | `mobilepay` |  Use your own phone number and MobilePay application, charges are not made with test credentials
OP | `osuuspankki` |  Username: 123456<br>Password: 7890<br>Security code: any
Nordea | `nordea` |  Username: 123456<br>Password: 1111<br>Security code: any
Handelsbanken<br>POP Pankki<br>Säästöpankki<br>OmaSP | `handelsbanken`<br>`pop`<br>`saastopankki`<br>`omasp` |  Username: 11111111<br>Password: 123456<br>Security code: 123456
Aktia | `aktia` |  Username: 12345678<br>Password: 123456<br>Security code: 1234
S-Pankki | `spankki` |  Username: 12345678<br>Password: 9999<br>Security code: 1234
Ålandsbanken | `alandsbanken`|  Username: 12345678<br>Password: 1234<br>Security code: any
Danske | `danske` |  Danske test account login requires using real Danske credentials
Visa | `creditcard` |  Card number: 4153013999700024<br>Expiry date: 11/2023<br>CVC: 024
Mastercard | `creditcard` |  Card number: 5353299308701770<br>Expiry date: 11/2023<br>CVC: 770
American Express | `amex` |  Card number: 373953192351004<br>Expiry date: 12/2023<br>CVC: 1004
Collector<br>Collector B2B | `collectorb2c`<br>`collectorb2b` |  Social security number: 010380-000P
Mash | `mash` |  Generate a social security number with [Mash provided service](https://sc-rel.mash.com/My/Test/GenerateSsnForTesting?age=34&tps=651)
Pivo | `pivo` | Testing is not possible
Siirto | `siirto` | Testing is not possible
AinaPay | `ainapay` | Testing is not possible
OP Lasku | `oplasku` | Testing is not possible
Jousto | `jousto` | Testing is not possible

## Provider limitations

### General limitations

Some payment method providers have minimum and/or maximum amounts for the purchases. These are not currently enforced by the API for other than Mash and AinaPay.

### Refunds

API refunds have been implemented for all providers supporting them. Currently payments created by the following methods can be refunded only with email refunds due to their lack of a refund API:

* S-pankki
* Ålandsbanken
* AinaPay

There can be limitations in the refund APIs too, eg. Nordea API allows to refund only once per payment, and only for payments created less than 13 weeks earlier.

#### Refunds with test account

In addition to the limitations above, the following restrictions apply for refunding test account payments:

* Nordea refunds do not work
* Aktia refunds do not work

