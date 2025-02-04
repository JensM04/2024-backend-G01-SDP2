# G01 - Software Development Project II - Web Service

## Studenten

| Naam                  | E-mail                                    | StudentenNr |
| --------------------- | ----------------------------------------- | ----------- |
| Michiel Van Hoorebeke | <michiel.vanhoorebeke2@student.hogent.be> | 202293204   |
| Jens Meersschaert     | <jens.meersschaert@student.hogent.be>     | 202289299   |
| Corneel Verstraeten   | <corneel.verstraeten@student.hogent.be>   | 202184154   |
| Kevin Wauman          | <kevin.wauman@student.hogent.be>          |             |
| Viktor Huygebaert     | <viktor.huygebaert@student.hogent.be>     | 202290063   |

## Doel van de applicatie

Deze API dient als ruggengraat van ons portaal. Hierdoor wordt het ophalen van data uit de databank mogelijk gemaakt, alsook het filteren, sorteren en selecteren van specifieke data.

## Minimum vereisten

Volgende software is reeds geïnstalleerd:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Opstarten applicatie

1. `.env-cmdrc.json` bestand aanmaken in root van het project
2. voeg de volgende code toe aan het bestand

```json
{
  "development-local": {
    "DATABASE_URL": "DATABASE_URL=mysql://<local-username>:<local-password>@localhost:<mysql-server-poort>/<schema>"
  },
  "test-local": {
    "NODE_ENV": "test",
    "DATABASE_URL": "mysql://<local-username>:<local-password>@localhost:<db-port>/<scheme-name>_TEST"
  }
}
```

3. `.env ` bestand aanmaken in root van het project
4. Volgende code in .env bestand

```json
DATABASE_URL="mysql://<local-username>:<local-password>@localhost:<db-port>/<scheme-name>"
```

5. In terminal:
   1. Dependencies installeren:
      - `yarn`
   2. Databank initialiseren:
      - `yarn prisma-push-local`
   3. Databank seeden:
      - `yarn prisma-seed-local`
   4. Service opstarten:
      - `yarn start-local`

> bron: [https://www.npmjs.com/package/env-cmd](https://www.npmjs.com/package/env-cmd#-advanced-usage)

> bron: [https://www.prisma.io/docs/orm/reference/prisma-cli-reference](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#examples-6)

## Testen applicatie

Er zijn 2 manieren om deze applicatie te testen.

Alle testen tegelijk:

1. Initialiseren test-databank
   - `yarn prisma-push-test`
2. Opstarten testen
   - `yarn test`

Individuele testsuites:

1. Initialiseren test-databank
   - `yarn prisma-push-test`
2. Testsuite opstarten:
   - Bestellingen testen:
     - `yarn test:bes`
   - User testen:
     - `yarn test:u`
   - Producten testen:
     - `yarn test:p`
   - Producten in bestelling testen:
     - `yarn test:pib`
   - Notificaties testen:
     - `yarn test:n`
   - Bedrijven testen:
     - `yarn test:bed`
   - Betalingen testen:
     - `yarn test:bet`

## Documentatie raadplegen

1. Start webservice op dmv `yarn start-local`
2. Surf naar <http://localhost:9000/swagger>
