// School nomenclature: MUNI (see README for sources and accepted variants).
// Columns: atomic number | symbol | Czech | Latin | group | school set.
const rows = `
1|H|vodík|hydrogenium|nonmetal|1
2|He|helium|helium|noble|1
3|Li|lithium|lithium|alkali|1
4|Be|beryllium|beryllium|earth|1
5|B|bor|borum|metalloid|1
6|C|uhlík|carboneum|nonmetal|1
7|N|dusík|nitrogenium|nonmetal|1
8|O|kyslík|oxygenium|nonmetal|1
9|F|fluor|fluorum|halogen|1
10|Ne|neon|neonum|noble|1
11|Na|sodík|natrium|alkali|1
12|Mg|hořčík|magnesium|earth|1
13|Al|hliník|aluminium|metal|1
14|Si|křemík|silicium|metalloid|1
15|P|fosfor|phosphorus|nonmetal|1
16|S|síra|sulphur|nonmetal|1
17|Cl|chlor|chlorum|halogen|1
18|Ar|argon|argonum|noble|1
19|K|draslík|kalium|alkali|1
20|Ca|vápník|calcium|earth|1
21|Sc|skandium|scandium|transition|0
22|Ti|titan|titanium|transition|1
23|V|vanad|vanadium|transition|0
24|Cr|chrom|chromium|transition|1
25|Mn|mangan|manganum|transition|1
26|Fe|železo|ferrum|transition|1
27|Co|kobalt|cobaltum|transition|1
28|Ni|nikl|niccolum|transition|1
29|Cu|měď|cuprum|transition|1
30|Zn|zinek|zincum|transition|1
31|Ga|gallium|gallium|metal|0
32|Ge|germanium|germanium|metalloid|0
33|As|arsen|arsenicum|metalloid|1
34|Se|selen|selenium|nonmetal|0
35|Br|brom|bromum|halogen|1
36|Kr|krypton|kryptonum|noble|0
37|Rb|rubidium|rubidium|alkali|0
38|Sr|stroncium|strontium|earth|0
39|Y|yttrium|yttrium|transition|0
40|Zr|zirkonium|zirconium|transition|0
41|Nb|niob|niobium|transition|0
42|Mo|molybden|molybdaenum|transition|0
43|Tc|technecium|technetium|transition|0
44|Ru|ruthenium|ruthenium|transition|0
45|Rh|rhodium|rhodium|transition|0
46|Pd|palladium|palladium|transition|0
47|Ag|stříbro|argentum|transition|1
48|Cd|kadmium|cadmium|transition|0
49|In|indium|indium|metal|0
50|Sn|cín|stannum|metal|1
51|Sb|antimon|stibium|metalloid|1
52|Te|tellur|tellurium|metalloid|0
53|I|jod|iodum|halogen|1
54|Xe|xenon|xenonum|noble|0
55|Cs|cesium|caesium|alkali|0
56|Ba|baryum|baryum|earth|1
72|Hf|hafnium|hafnium|transition|0
73|Ta|tantal|tantalum|transition|0
74|W|wolfram|wolframum|transition|1
75|Re|rhenium|rhenium|transition|0
76|Os|osmium|osmium|transition|0
77|Ir|iridium|iridium|transition|0
78|Pt|platina|platinum|transition|1
79|Au|zlato|aurum|transition|1
80|Hg|rtuť|hydrargyrum|transition|1
81|Tl|thallium|thallium|metal|0
82|Pb|olovo|plumbum|metal|1
83|Bi|bismut|bismuthum|metal|0
84|Po|polonium|polonium|metal|0
85|At|astat|astatinum|halogen|0
86|Rn|radon|radonum|noble|0
87|Fr|francium|francium|alkali|0
88|Ra|radium|radium|earth|0
`;

const variants = {
  10: { la: ['neon'] },
  16: { la: ['sulfur', 'sulfurum', 'sulphurium'] },
  18: { la: ['argon'] },
  33: { cs: ['arzen'] },
  36: { la: ['krypton'] },
  42: { la: ['molybdenum'] },
  56: { la: ['barium'] },
  74: { la: ['wolframium'] },
  85: { la: ['astatium'] },
  86: { la: ['radon'] },
};

// Visual mnemonics: an association with a use, a property, or the name's origin.
// These are native pictograms, not photographs of pure chemical samples.
const hintRows = `
1|💧|Voda|Vodík je spolu s kyslíkem součástí molekul vody.|hydrogen
2|🎈|Balónky|Lehké a málo reaktivní helium se používá k plnění balónků.|helium
3|🔋|Baterie|Lithium se používá v dobíjecích bateriích telefonů a elektromobilů.|lithium
4|⚙️|Letecké součástky|Slitiny s berylliem se využívají v leteckém průmyslu.|beryllium
5|🧪|Žáruvzdorné sklo|Oxid boritý je součástí borosilikátového skla odolného vůči teplu.|boron
6|✏️|Tužka|Grafit v tužce je jednou z forem uhlíku.|carbon
7|🌾|Hnojiva|Sloučeniny dusíku se používají v hnojivech pro růst rostlin.|nitrogen
8|🫁|Dýchání|Kyslík je nezbytný pro buněčné dýchání člověka.|oxygen
9|🪥|Zubní pasta|Zubní pasty mohou obsahovat fluoridy, tedy sloučeniny fluoru.|fluorine
10|💡|Svítící reklamy|Neon ve výbojce svítí červenooranžově a využívá se v reklamách.|neon
11|🧂|Kuchyňská sůl|Kuchyňská sůl je chlorid sodný, sloučenina sodíku a chloru.|sodium
12|✨|Bílé světlo|Hořčík při hoření vydává jasné bílé světlo.|magnesium
13|🥫|Plechovky|Lehký hliník se používá při výrobě nápojových plechovek.|aluminium
14|💻|Počítačové čipy|Křemík je polovodič používaný v počítačových čipech.|silicon
15|🔥|Zápalky|Červený fosfor je součástí škrtací plochy bezpečnostních zápalek.|phosphorus
16|🟡|Žluté krystaly|Běžná forma síry tvoří žluté krystaly nebo prášek.|sulfur
17|🏊|Bazén|Chlor a jeho sloučeniny se používají k dezinfekci bazénové vody.|chlorine
18|🧑‍🏭|Svařování|Argon vytváří ochrannou atmosféru při svařování.|argon
19|🌱|Hnojiva|Sloučeniny draslíku patří mezi důležité složky hnojiv.|potassium
20|🦴|Kosti|Sloučeniny vápníku jsou důležitou součástí kostí.|calcium
21|🚲|Lehké rámy kol|Slitiny hliníku a skandia se používají v lehkých rámech kol.|scandium
22|🦿|Implantáty|Titan dobře spolupracuje s kostí a používá se v implantátech.|titanium
23|🔧|Ocelové nástroje|Příměs vanadu zvyšuje odolnost oceli používané v nástrojích.|vanadium
24|🪞|Lesklý povrch|Chromování může dát kovovému povrchu zrcadlový lesk.|chromium
25|🚆|Kolejnice|Manganová ocel je odolná a využívá se například na kolejnice.|manganese
26|🧲|Magnety|Železo a některé jeho slitiny či sloučeniny se používají v magnetech.|iron
27|🔵|Modrý pigment|Sloučeniny kobaltu dávají sklu a keramice výraznou modrou barvu.|cobalt
28|🪙|Mince|Nikl se používá v mincovních slitinách, často spolu s mědí.|nickel
29|🔌|Elektrické vodiče|Měď dobře vede elektřinu a používá se v kabelech.|copper
30|🛡️|Ochrana proti korozi|Zinkování chrání ocel před korozí.|zinc
31|🐓|Kohout|Gallium připomíná latinské gallus, kohout; název souvisí také s Francií.|gallium
32|📷|Optické čočky|Oxid germania se používá v některých optických čočkách.|germanium
33|💻|Polovodiče|Arsenid gallitý je sloučenina arsenu využívaná v polovodičích.|arsenic
34|🌙|Měsíc|Název selenu odkazuje na Seléné, řeckou bohyni Měsíce.|selenium
35|🎞️|Fotografický film|Bromid stříbrný se používá ve fotografickém filmu.|bromine
36|📸|Fotografický blesk|Krypton se používá v některých výbojkách pro rychlé fotografování.|krypton
37|👁️|Světelná čidla|Rubidium bylo využíváno ve fotobuňkách, které reagují na světlo.|rubidium
38|🎆|Červený ohňostroj|Soli stroncia dávají ohňostroji výraznou červenou barvu.|strontium
39|📺|Televizní obrazovky|Sloučeniny yttria se používaly pro červenou barvu obrazovek starších televizorů.|yttrium
40|💎|Kubická zirkonie|Kubická zirkonie je syntetický drahokam tvořený oxidem zirkoničitým.|zirconium
41|🧲|Supravodivé magnety|Slitiny s niobem se používají v supravodivých magnetech.|niobium
42|🛠️|Odolné nástroje|Slitiny s molybdenem se používají například ve vrtácích a pilách.|molybdenum
43|🩻|Lékařské zobrazení|Technecium-99m se používá při diagnostickém zobrazování orgánů.|technetium
44|🔌|Elektrické kontakty|Ruthenium se využívá v odolných elektrických kontaktech.|ruthenium
45|🌹|Růže|Název rhodia pochází z řeckého slova pro růži a odkazuje na barvu jeho solí.|rhodium
46|☄️|Planetka Pallas|Palladium bylo pojmenováno podle planetky Pallas.|palladium
47|🪞|Zrcadla|Stříbro velmi dobře odráží světlo a používá se při výrobě zrcadel.|silver
48|🔋|Akumulátory Ni-Cd|Kadmium se používá v nikl-kadmiových akumulátorech.|cadmium
49|📱|Dotykové displeje|Oxid india a cínu tvoří průhlednou vodivou vrstvu dotykových displejů.|indium
50|🥫|Pocínované konzervy|Ocelové konzervy mohou mít ochranný povlak z cínu.|tin
51|🧯|Zpomalení hoření|Sloučeniny antimonu se používají v materiálech zpomalujících hoření.|antimony
52|🌍|Země|Tellur dostal název podle latinského tellus, tedy Země.|tellurium
53|🌊|Mořské řasy|Mnohé mořské řasy obsahují jod, který z nich byl historicky získáván.|iodine
54|📸|Fotoblesk|Xenon se používá ve výbojkách fotografických blesků.|xenon
55|⏱️|Atomové hodiny|Cesium se používá v přesných atomových hodinách.|caesium
56|🩻|Rentgenový kontrast|Síran barnatý se používá jako kontrastní látka při rentgenovém vyšetření.|barium
72|🏙️|Kodaň|Hafnium dostalo název podle latinského názvu Kodaně, Hafnia.|hafnium
73|📱|Kondenzátory|Tantal se používá v malých kondenzátorech přenosné elektroniky.|tantalum
74|💡|Žárovkové vlákno|Wolfram se používal ve vláknech klasických žárovek.|tungsten
75|✈️|Turbínové lopatky|Rhenium se přidává do slitin pro lopatky turbín.|rhenium
76|⚖️|Velká hustota|Osmium patří k nejhustším prvkům.|osmium
77|🌈|Duha|Název iridia odkazuje na duhu a výrazné barvy jeho solí.|iridium
78|💍|Šperky|Platina je odolný drahý kov používaný ve šperkařství.|platinum
79|👑|Zlaté šperky|Zlato se používá ve špercích jako čistý kov i ve slitinách.|gold
80|🌡️|Staré teploměry|Kapalná rtuť se dříve běžně používala v teploměrech.|mercury
81|🌱|Zelená ratolest|Název thallia pochází z řeckého slova pro zelený výhonek.|thallium
82|🔋|Autobaterie|Olovo se používá v olověných akumulátorech automobilů.|lead
83|💄|Perleťová kosmetika|Oxychlorid bismutitý dává některým kosmetickým přípravkům perleťový vzhled.|bismuth
84|🇵🇱|Polsko|Marie Curie pojmenovala polonium podle své rodné země, Polska.|polonium
85|⏳|Nestálost|Astat je nestálý radioaktivní prvek; název vychází z řeckého astatos.|astatine
86|🏠|Podloží domů|Radon se může z podloží uvolňovat do budov.|radon
87|🇫🇷|Francie|Francium bylo pojmenováno podle Francie.|francium
88|☢️|Radioaktivita|Radium je silně radioaktivní prvek.|radium
`;
const hints = Object.fromEntries(hintRows.trim().split('\n').map(row => {
  const [number, icon, caption, explanation, slug] = row.split('|');
  return [number, { icon, caption, explanation, source: `https://periodic-table.rsc.org/element/${number}/${slug}` }];
}));

export const elements = rows.trim().split('\n').map(row => {
  const [n, symbol, cs, la, category, common] = row.split('|');
  return { number: Number(n), symbol, cs, la, category, common: common === '1', aliases: variants[n] || {}, hint: hints[n] };
});

export const categories = {
  nonmetal: 'Nekovy', noble: 'Vzácné plyny', alkali: 'Alkalické kovy',
  earth: 'Kovy alkalických zemin', metalloid: 'Polokovy',
  halogen: 'Halogeny', transition: 'Přechodné kovy', metal: 'Ostatní kovy',
};
