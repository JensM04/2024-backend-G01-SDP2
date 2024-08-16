const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = async () => {
    console.log('GLOBAL SETUP');
    /*
        deze methode creert volgende zaken in de database als startpunt om zaken zoals notificaties, betalingen en bestellingen aan te kunnen linken in de testklassen.
        2 bedrijven:
        - Bedrijf1
            - ID: 1
            - Leverancier
                - ID: 1
                - Gebruikersnaam: Proximus_Test_Leverancier
            - Klant
                - ID: 2
                - Gebruikersnaam: Proximus_Test_Klant
        - Bedrijf2
            - ID: 2
            - Leverancier
                - ID: 3
                - Gebruikersnaam: Microsoft_Test_Leverancier
            - Klant
                - ID: 4
                - Gebruikersnaam: Microsoft_Test_Klant
        Daarnaast wordt er ook telkens 1 administrator aangemaakt.
            - Administrator
                - ID: 5
                - Gebruikersnaam: Administrator_Test
        Voor alle accounts zou je moeten inloggen met het wachtwoord: 'wachtwoord'
        maar dit doe je automatisch via het aanroepen van de methode in je testklasse: login, gehaald uit supertest.setup.js
        
    */
    try {
        console.log('Creating users...');
        
        await prisma.b2BBEDRIJF.upsert({
            where: { BEDRIJFID: 1 },
            update: {},
            create: {
                BEDRIJFID: 1,
                EMAIL: 'bedrijf1@test.com',
                ISACTIEF: true,
                NAAM: 'Bedrijf1',
                SECTOR: 'IT',
                TELEFOONNUMMER: '0477777777',
                UUIDVALUE: '7eb8dffd-3906-488a-bb5a-97c032873ae3',
                WEBSITEURL: 'www.bedrijf1.com',
                GEMEENTE: 'Gent',
                HUISNUMMER: 1,
                POSTCODE: 9000,
                STRAAT: 'Veldstraat',
                LEVERANCIER_B2BBEDRIJF: {
                    create: {
                        GEBRUIKER: {
                            create : {
                                ID: 1,
                                DTYPE: 'Leverancier',
                                EMAIL:'email@email.com',
                                GEBRUIKERSNAAM: 'Proximus_Test_Leverancier',
                                ISWACHTWOORDVERANDERD: true,
                                ROL: 0,
                                SALT:'QsXEnEWmwMvIDqshan4dkjWhwLyIT6',
                                WACHTWOORD_HASH:'535243b77bd5d61451e00a91a5ec767c84883b7a5a53fb50a60f6868b07a3d3d',
                                LEVERANCIER: {
                                    create: {}
                                }
                            }
                        }
                    }
                },
                KLANT_B2BBEDRIJF: {
                    create: {
                        GEBRUIKER: {
                            create: {
                                ID: 2,
                                DTYPE: 'Klant',
                                EMAIL:'email@klant.com',
                                GEBRUIKERSNAAM: 'Proximus_Test_Klant',
                                ISWACHTWOORDVERANDERD: true,
                                ROL: 1,
                                SALT:'QsXEnEWmwMvIDqshan4dkjWhwLyIT6',
                                WACHTWOORD_HASH:'535243b77bd5d61451e00a91a5ec767c84883b7a5a53fb50a60f6868b07a3d3d',
                                KLANT: {
                                    create: {}
                                }
                            }
                        }
                    }
                }
            }
            
        });

        await prisma.b2BBEDRIJF.upsert({
            where: { BEDRIJFID: 2 },
            update: {},
            create: {
                BEDRIJFID: 2,
                EMAIL: 'bedrijf2@test.com',
                ISACTIEF: true,
                NAAM: 'Bedrijf2',
                SECTOR: 'IT',
                TELEFOONNUMMER: '0488888888',
                UUIDVALUE: '7eb8dffd-3006-488a-bb5a-97c032873ae3',
                WEBSITEURL: 'www.bedrijf2.com',
                GEMEENTE: 'Gent',
                HUISNUMMER: 2,
                POSTCODE: 9000,
                STRAAT: 'Verderstraat',
                LEVERANCIER_B2BBEDRIJF: {
                    create: {
                        GEBRUIKER: {
                            create : {
                                ID: 3,
                                DTYPE: 'Leverancier',
                                EMAIL:'email@email2.com',
                                GEBRUIKERSNAAM: 'Microsoft_Test_Leverancier',
                                ISWACHTWOORDVERANDERD: true,
                                ROL: 0,
                                SALT:'QsXEnEWmwMvIDqshan4dkjWhwLyIT6',
                                WACHTWOORD_HASH:'535243b77bd5d61451e00a91a5ec767c84883b7a5a53fb50a60f6868b07a3d3d',
                                LEVERANCIER: {
                                    create: {}
                                }
                            }
                        }
                    }
                },
                KLANT_B2BBEDRIJF: {
                    create: {
                        GEBRUIKER: {
                            create: {
                                ID: 4,
                                DTYPE: 'Klant',
                                EMAIL:'email@klant2.com',
                                GEBRUIKERSNAAM: 'Microsoft_Test_Klant',
                                ISWACHTWOORDVERANDERD: true,
                                ROL: 1,
                                SALT:'QsXEnEWmwMvIDqshan4dkjWhwLyIT6',
                                WACHTWOORD_HASH:'535243b77bd5d61451e00a91a5ec767c84883b7a5a53fb50a60f6868b07a3d3d',
                                KLANT: {
                                    create: {}
                                }
                            }
                        }
                    }
                }
            }
        });         

        await prisma.gEBRUIKER.create({
            data:
                {   
                    ID: 5,
                    DTYPE: 'Administrator',
                    EMAIL:'admin@test.com',
                    GEBRUIKERSNAAM: 'Administrator_Test',
                    ISWACHTWOORDVERANDERD: true,
                    ROL: 2,
                    SALT:'8tMCYEITdzegz0ajBhP3NrCNhW4erF',
                    WACHTWOORD_HASH:'91be9f50ff0cfcb093814713df6c00ad6a4175618664286a6d5046e9ca0f2049', 
                }
        });
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
};
