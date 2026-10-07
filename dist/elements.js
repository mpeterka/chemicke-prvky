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

export const elements = rows.trim().split('\n').map(row => {
  const [n, symbol, cs, la, category, common] = row.split('|');
  return { number: Number(n), symbol, cs, la, category, common: common === '1', aliases: variants[n] || {} };
});

export const categories = {
  nonmetal: 'Nekovy', noble: 'Vzácné plyny', alkali: 'Alkalické kovy',
  earth: 'Kovy alkalických zemin', metalloid: 'Polokovy',
  halogen: 'Halogeny', transition: 'Přechodné kovy', metal: 'Ostatní kovy',
};
