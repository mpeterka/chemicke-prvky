# Prvky

Lokální verze k vyzkoušení: http://127.0.0.1:4175/. Publikace na GitHub Pages čeká na připomínky uživatele.

Český výukový kvíz: k jednomu údaji doplníš zbylé dva — český název, latinský název a chemickou značku. Deset otázek v kole střídá výběr ze čtyř možností s volným textem. Otázky nemají časový limit. Po kontrole se odhalí celá buňka prvku a obličej z dodané fotografie: veselý při správné odpovědi, zamračený při chybě. Bod získáš za obě správná přiřazení; chybné prvky lze zopakovat samostatně.

## Prvky a názvosloví

- Školní základ: výběr 40 běžných prvků.
- Celá sada: 73 prvků, protonová čísla 1–56 a 72–88.
- Prozatím vynechány lanthanoidy a aktinoidy včetně La a Ac (obě spodní řady, 57–71 a 89–103) a prvky 104–118.
- Radioaktivní prvky v hlavní části tabulky zůstávají: nejde o filtr radioaktivity.

Základní názvosloví: [Masarykova univerzita — Názvosloví chemických prvků](https://www.ped.muni.cz/wchem/sm/hc/so/soubory/pojmy/prvky.pdf). Latinské názvy nejsou anglické názvy. Oprava názvu tantalu podle [samostatného materiálu MUNI](https://www.ped.muni.cz/wchem/sm/hc/hist/chemlat/tantal.html). Varianty doložené také v [tabulce MUNI 2017](https://is.muni.cz/el/sci/podzim2020/C1040/um/Ceske_nazvy_prvku_2017.pdf) a [přednášce MUNI](https://is.muni.cz/el/sci/podzim2020/F3200/um/prezentace_z_prednasky/prednaska_atom.pdf).

U názvů se ignorují krajní mezery, velikost písmen a diakritika. U značek záleží na velikosti písmen: `Co` a `CO` jsou různé zápisy. Volný text přijímá vyjmenované varianty názvů (například molybdaenum/molybdenum, wolframum/wolframium, sulphur/sulfurum). Přehled prvků ukazuje i přijímané varianty. Další prvky lze přidat v `dist/elements.js`.

## iPad a pokrok

Dotyková tlačítka mají alespoň 48 px. Není nutné přetahování, hover ani instalace aplikace. Stránka zachovává přibližování a funguje na výšku i na šířku. Doporučen Safari na iPadOS 16 nebo novějším. Výsledek se oznamuje textem i barvou a ovládání podporuje klávesnici.

Pokrok se ukládá do localStorage tohoto prohlížeče, bez účtu a bez synchronizace zařízení. Při nedostupném úložišti můžeš dál hrát; rozhraní upozorní, že výsledky vydrží jen během otevřené stránky. Aktivní rozehrané kolo se po obnovení stránky nespustí automaticky; dosavadní kontrolované odpovědi zůstávají uložené.

## Vývoj a ověření

Node.js 22+, žádné produkční závislosti nebo build.

```powershell
npm test
npm run dev
```

Lokální aplikace: http://127.0.0.1:4175/. Statické soubory v `dist/` jsou zároveň distribucí.

Testy používají vestavěný test runner Node.js a kontrolují data, pravidla, textové odpovědi, bodování, úložiště a lokální server. Volitelná kontrola celého rozhraní používá Playwright:

```powershell
# Playwright může být nainstalovaný lokálně, nebo poskytnutý pracovním runtime.
# PLAYWRIGHT_MODULE je případně absolutní cesta k playwright/index.mjs.
node scripts/check-browser.mjs
```

Kontrola projde v Chromium a WebKit rozložení 768×1024, 1024×768 a 390×844 s dotykovým ovládáním, celé smíšené kolo, chyby, opakování, vyhledávání, dialog a uložený pokrok. Obrázky z ověření se ukládají do ignorované složky `.qa/`. Fyzický iPad nebyl během vývoje použit; emulace neověřuje chování skutečné softwarové klávesnice.

## Publikování

GitHub Actions po pushi do `main` spustí testy a kontrolu syntaxe a publikuje `dist/` na GitHub Pages. V nastavení repozitáře je zdrojem Pages GitHub Actions. Žádné externí CDN nebo analytické služby.
