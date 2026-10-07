# Chemické prvky — návrh aplikace

## Cíl a rozsah
Česká výuková aplikace pro přiřazování českého názvu, latinského názvu a chemické značky. Publikace v novém veřejném repozitáři `mpeterka/chemicke-prvky` na GitHub Pages. Primární zařízení: iPad se Safari; aplikace musí fungovat také na telefonu a počítači.

Zahrnuto 73 prvků: protonová čísla 1–56 a 72–88. Prozatím vynechány obě spodní řady včetně lanthanu a aktinia (57–71 a 89–103) a supertěžké prvky 104–118. Nejde o filtr všech radioaktivních prvků: technecium, polonium, astat, radon, francium a radium zůstávají. Rozsah je uveden v rozhraní. Datová struktura umožní pozdější doplnění vynechaných prvků.

## Kvíz
Na úvodní obrazovce lze zvolit běžné školní prvky nebo všech 73 zahrnutých prvků. Jedno kolo obsahuje 10 různých prvků. Otázka střídavě ukáže český název, latinský název nebo značku. Uživatel ve dvou oddělených skupinách vybere zbývající dvě části z nabídky čtyř možností a klepne na „Zkontrolovat“. Odpovědi lze před kontrolou měnit.

Po kontrole se zobrazí správná trojice a vyznačí správné i chybné volby. Bod náleží pouze za obě správná přiřazení; opakované klepnutí skóre nezmění. Pokračování je ruční, aby měl uživatel čas opravu přečíst. Konec kola ukáže skóre a nabídne nové kolo nebo opakování chybných prvků. Opakování neobsahuje prvky, které uživatel zodpověděl správně; při méně než 10 chybách obsahuje jen dostupné chybné prvky.

## Učení a pokrok
Přehled prvků nabízí vyhledávání podle českého názvu, latinského názvu a značky; vyhledávání českých názvů funguje i bez diakritiky. Každá položka ukazuje celou trojici a protonové číslo. Úspěchy a chyby u jednotlivých prvků se ukládají pouze na tomto zařízení pomocí localStorage. Nedostupné úložiště ani poškozená uložená data nesmějí zabránit hraní; rozhraní sdělí, pokud pokrok nelze uložit.

## Vzhled a ovládání
Vizuální motiv vychází z kartiček chemických prvků: velká značka prvku a dvě jasně označené skupiny odpovědí. Světlé modrošedé pozadí #EDF4F8, tmavě modrý text #18334B, modrá akce #1767B2, zelené potvrzení #17734D, červená chyba #B52D42, bílá #FFFFFF. Systémové písmo pro rychlé načtení a dobrou čitelnost v Safari. Výsledek bude sdělen textem, ne pouze barvou.

Na iPadu dvě skupiny odpovědí vedle sebe, na úzkém telefonu pod sebou. Dotykové cíle minimálně 48 px, žádné nutné přetahování nebo ovládání závislé na hoveru. Zachovat zoom stránky, viditelný focus a ovládání klávesnicí. Rozložení musí fungovat na výšku i na šířku bez vodorovného posouvání stránky. Použít podporu omezeného pohybu; žádný povinný časový limit.

## Technické řešení
Statické HTML, CSS a JavaScript bez frameworku a bez serveru. Relativní odkazy kvůli hostování pod `/chemicke-prvky/`. Oddělená data prvků a malý modul pravidel kvízu umožní ověření pomocí vestavěných testů Node.js. GitHub Actions spustí testy a nasadí statické soubory na GitHub Pages. Žádné externí CDN ani přihlášení.

Názvosloví ověřit podle výukových materiálů Masarykovy univerzity: https://www.ped.muni.cz/wchem/sm/hc/so/soubory/pojmy/prvky.pdf. V aplikaci a README uvést zdroj. Chemická značka zachovává velikost písmen, latinské názvy se zobrazují konzistentně.

## Ověření a dokončení
Ověřit jedinečnost a rozsah všech 73 datových záznamů, obsah správné odpovědi a jedinečnost možností, střídání všech tří zadání, vyhodnocení celé trojice, ochranu proti dvojímu bodování, opakování chyb a chování poškozeného úložiště. Ověřit v prohlížeči celý průchod kolem a dotykové rozložení při 768 × 1024, 1024 × 768 a 390 × 844. Emulace nenahrazuje fyzický iPad; tento limit uvést při předání. Po publikaci ověřit úspěšný deployment a dostupnost veřejné stránky. Předat odkaz na aplikaci a repozitář.
