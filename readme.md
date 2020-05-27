# Piirtopeli
## Node.js
Käynnistääksesi peliserverin, sinun tulee asentaa Node.js. Jonka uusimman version saat [***täältä***](https://nodejs.org/en/)

## Tekstieditori
Jos sinua kiinnostaa pelin kehitys/modaaminen niin sinulla tulisi olla hyvä tekstieditori kuten, [***Visual Studi Code***](https://code.visualstudio.com/). Siinä on itsessään monia hyviä työkaluja ja siihen myös löytyy paljon lisäosia jotka helpottavat pelinkehitystä.

## Node paketit

Asentaaksesi node moduulit peliin sinun tulee avata piirtopeliohjelma-kansio komentokehotteessa. Se tapahtuu kirjoittamalla
```sh
cd "C:/kansion polku/"
```
Sitten ollaankin valmiita asentamaan node paketit:
```sh
npm install
```
Odottele asennuksen päättymistä ja kirjoita:
```sh
npm start
```
Komentokehotteen tulisi nyt printata:
```sh
Serveri portissa 3000 toimii!
```
Serverin sammutus, tapahtuu tekemällä seuraava näppäinyhdistelmä kahdesti: CTRL+C

## Portin vaihto
Tiedostossa index.js, rivillä 7 määritellään sovelluksen portti numero. Muuttamalla lukua saat muutettua porttia (serveriin tehtävät muutokset vaativat aina sen uudelleen käynnistyksen)

## Tiedossa  olevat bugit
- Piirtäjä voi viedä jonkun toisen vastausvuoron, kirjoittamalla itse vastauksen chattiin.
- Piirtäjän generoidessa uusi sana, luulee serveri kierroksen vaihtuneen, joten serveri lisää uuden kierroksen laskuriin.
- Samalla pelaajanimellä pelaavat kohtaavat monia erilaisia ongelmia.
- Pelaajat voivat häiritä piirtäjää poistamalla inspect-elementillä ***draw-block***-nimisen elementin, jolloin he myös voivat piirtää.
- Muuttamalla koodia saa näkyviin oikean sanan. Korjaus tullaan tekemään siirtämällä viestin tarkistus serverin puolelle. (Muuttamalla JavaScript koodia voidaan tehdä muitakin muutoksia, jotka myös tullaan korjaamaan samalla tavalla.)

## Tulevaisuuden parannuksia
- Pelin tietoturvaa tullaan parantamaan muuttamalla serverin ja "client":in ohjelmistorakennetta.
- Kirjautuminen tullaan muuttaamaan "kertakäyttöisen" käyttäjätilin sijaan, tietokantaan talletettavaan käyttäjätiliin (Tällä tavoin saadaan myös korjattua bugi, jossa samalla käyttäjänimellä pelaavat kohtaavat pelissä ongelmia).
- Käyttäjätili sidonnainen pistejärjestelmä.
- Suurempi väripaletti