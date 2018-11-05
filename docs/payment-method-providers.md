<img src="images/checkout-logo-vaaka-RGB.png" alt="Checkout Finland Oy" style="width: 200px;">

# Payment method providers

The payment methods that can be tested without real money transactions have been enabled for the test accounts. Test credentials for the services can be found below.

## Test credentials

<p class="tip">
  Handelsbanken, POP, Säästöpankki, and OmaSP test credentials do not work at the moment. Samlink has identified the problem but fixing it is not scheduled.
</p>

Provider | Credentials
---------| -----------
Masterpass | Use *IE English* Masterpass wallet and one of the [provided credit cards](https://developer.mastercard.com/page/masterpass-sandbox-testing-guidelines)
MobilePay | Use your own phone number and MobilePay application, charges are not made with test credentials
Osuuspankki | Username: 123456<br>Password: 7890<br>Security code: any
Nordea | Username: 123456<br>Password: 1111<br>Security code: any
Handelsbanken<br>POP Pankki<br>Säästöpankki<br>OmaSP | Username: 11111111<br>Password: 123456<br>Security code: 123456
Aktia | Username: 12345678<br>Password: 123456<br>Security code: 1234
S-Pankki | Username: 12345678<br>Password: 9999<br>Security code: 1234
Ålandsbanken | Username: 12345678<br>Password: 1234<br>Security code: any
Danske | Danske test account login requires using real Danske credentials
Visa | Card number: 4153013999700024<br>Expiry date: 11/2023<br>CVC: 024
Mastercard | Card number: 5353299308701770<br>Expiry date: 11/2023<br>CVC: 770
American Express | Card number: 373953192351004<br>Expiry date: 12/2023<br>CVC: 1004
Collector | Social security number: 010380-000P
Mash | Generate a social security number with [Mash provided service](https://sc-rel.mash.com/My/Test/GenerateSsnForTesting?age=34&tps=651)

## Provider limitations

### General limitations

Some payment method providers have minimum and/or maximum amounts for the purchases. These are not currently enforced by the API for other than Mash and AinaPay.

### Refunds

API refunds have been impmeneted for all providers supporting them. Currently payments created by the following methods can be refunded only with email refunds due to their lack of a refund API:

* S-pankki
* Ålandsbanken
* AinaPay

There can be limitations in the refund APIs too, eg. Nordea API allows to refund only once per payment, and only for payments created less than 13 weeks earlier.

#### Refunds with test account

In addition to the limitations above, the following restrictions apply for refunding test account payments:

* Nordea refunds do not work
* Aktia refunds do not work

