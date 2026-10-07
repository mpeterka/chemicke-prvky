# Revize UI/UX — 7. 10. 2026

Prohlédnuté obrazovky: úvod, výběr sady, oba režimy kvízu, nápověda, správná/chybná odpověď, výsledky, opakování chyb, přehled, vyhledávání a dialog s informacemi.

## Opravy

- Po otevření nápovědy obrázek nahradí otazník přímo v ovladači. Zavření vrátí otazník. Nevzniká druhý obrázek v obsahu kartičky.
- Odstup prvního pole od horního ovladače brání jejich dotýkání na telefonu.
- Spodní lišta má neprůhledné pozadí, aby za tlačítky neprosvítaly texty. Odsazení při posouvání a zaměření textových polí zohledňuje lištu.
- Přehled má legendu barev chemických skupin. Barva není jediným způsobem rozlišení; legenda uvádí názvy skupin.
- Dialog vysvětluje aktuální ovládání nápovědy. Zdroje jsou soustředěné v dialogu, nikoli na kartičkách.

## Ověření

Chromium a WebKit: rozměry 768×1024, 1024×768 a 390×844, dotykové ovládání. Kontrola celého kola v obou režimech, vyhodnocení, portrétů, opakování, vyhledávání, úložiště a zablokovaného úložiště. Kontroluje se vodorovné přetékání, výška tlačítek alespoň 48 px a pevné souřadnice hlavní akce.

Pořadí polí na kartičce je značka, latina, čeština. Zadání a dosazené odpovědi mají různé označení i rámeček. Nápověda se neotevírá sama a zachová stav při vyhodnocení. Dosazování má krátkou animaci respektující omezený pohyb.

Fyzický iPad nebyl k dispozici. Safari a skutečnou softwarovou klávesnici doporučujeme ověřit při uživatelském vyzkoušení; WebKit s emulací není totéž co skutečné zařízení.
