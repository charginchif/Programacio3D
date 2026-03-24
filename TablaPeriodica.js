import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as TWEEN from 'tween';

// --- DATABASE ---
const elementosData = [
    [1,"H","Hidrógeno","1.008",1,1], [2,"He","Helio","4.002",18,1], [3,"Li","Litio","6.94",1,2], [4,"Be","Berilio","9.012",2,2], [5,"B","Boro","10.81",13,2], [6,"C","Carbono","12.011",14,2], [7,"N","Nitrógeno","14.007",15,2], [8,"O","Oxígeno","15.999",16,2], [9,"F","Flúor","18.998",17,2], [10,"Ne","Neón","20.180",18,2], [11,"Na","Sodio","22.990",1,3], [12,"Mg","Magnesio","24.305",2,3], [13,"Al","Aluminio","26.982",13,3], [14,"Si","Silicio","28.085",14,3], [15,"P","Fósforo","30.974",15,3], [16,"S","Azufre","32.06",16,3], [17,"Cl","Cloro","35.45",17,3], [18,"Ar","Argón","39.95",18,3], [19,"K","Potasio","39.098",1,4], [20,"Ca","Calcio","40.078",2,4], [21,"Sc","Escandio","44.956",3,4], [22,"Ti","Titanio","47.867",4,4], [23,"V","Vanadio","50.942",5,4], [24,"Cr","Cromo","51.996",6,4], [25,"Mn","Manganeso","54.938",7,4], [26,"Fe","Hierro","55.845",8,4], [27,"Co","Cobalto","58.933",9,4], [28,"Ni","Níquel","58.693",10,4], [29,"Cu","Cobre","63.546",11,4], [30,"Zn","Zinc","65.38",12,4], [31,"Ga","Galio","69.723",13,4], [32,"Ge","Germanio","72.630",14,4], [33,"As","Arsénico","74.922",15,4], [34,"Se","Selenio","78.971",16,4], [35,"Br","Bromo","79.904",17,4], [36,"Kr","Kriptón","83.798",18,4], [37,"Rb","Rubidio","85.468",1,5], [38,"Sr","Estroncio","87.62",2,5], [39,"Y","Itrio","88.906",3,5], [40,"Zr","Circonio","91.224",4,5], [41,"Nb","Niobio","92.906",5,5], [42,"Mo","Molibdeno","95.95",6,5], [43,"Tc","Tecnecio","(98)",7,5], [44,"Ru","Rutenio","101.07",8,5], [45,"Rh","Rodio","102.91",9,5], [46,"Pd","Paladio","106.42",10,5], [47,"Ag","Plata","107.87",11,5], [48,"Cd","Cadmio","112.41",12,5], [49,"In","Indio","114.82",13,5], [50,"Sn","Estaño","118.71",14,5], [51,"Sb","Antimonio","121.76",15,5], [52,"Te","Telurio","127.60",16,5], [53,"I","Yodo","126.90",17,5], [54,"Xe","Xenón","131.29",18,5], [55,"Cs","Cesio","132.91",1,6], [56,"Ba","Bario","137.33",2,6], [57,"La","Lantano","138.91",4,9], [58,"Ce","Cerio","140.12",5,9], [59,"Pr","Praseodimio","140.91",6,9], [60,"Nd","Neodimio","144.24",7,9], [61,"Pm","Prometio","(145)",8,9], [62,"Sm","Samario","150.36",9,9], [63,"Eu","Europio","151.96",10,9], [64,"Gd","Gadolinio","157.25",11,9], [65,"Tb","Terbio","158.93",12,9], [66,"Dy","Disprosio","162.50",13,9], [67,"Ho","Holmio","164.93",14,9], [68,"Er","Erbio","167.26",15,9], [69,"Tm","Tulio","168.93",16,9], [70,"Yb","Iterbio","173.05",17,9], [71,"Lu","Lutecio","174.97",18,9], [72,"Hf","Hafnio","178.49",4,6], [73,"Ta","Tántalo","180.95",5,6], [74,"W","Wolframio","183.84",6,6], [75,"Re","Renio","186.21",7,6], [76,"Os","Osmio","190.23",8,6], [77,"Ir","Iridio","192.22",9,6], [78,"Pt","Platino","195.08",10,6], [79,"Au","Oro","196.97",11,6], [80,"Hg","Mercurio","200.59",12,6], [81,"Tl","Talio","204.38",13,6], [82,"Pb","Plomo","207.2",14,6], [83,"Bi","Bismuto","208.98",15,6], [84,"Po","Polonio","(209)",16,6], [85,"At","Astato","(210)",17,6], [86,"Rn","Radón","(222)",18,6], [87,"Fr","Francio","(223)",1,7], [88,"Ra","Radio","(226)",2,7], [89,"Ac","Actinio","(227)",4,10], [90,"Th","Torio","232.04",5,10], [91,"Pa","Protactinio","231.04",6,10], [92,"U","Uranio","238.03",7,10], [93,"Np","Neptunio","(237)",8,10], [94,"Pu","Plutonio","(244)",9,10], [95,"Am","Americio","(243)",10,10], [96,"Cm","Curio","(247)",11,10], [97,"Bk","Berkelio","(247)",12,10], [98,"Cf","Californio","(251)",13,10], [99,"Es","Einstenio","(252)",14,10], [100,"Fm","Fermio","(257)",15,10], [101,"Md","Mendelevio","(258)",16,10], [102,"No","Nobelio","(259)",17,10], [103,"Lr","Lawrencio","(266)",18,10], [104,"Rf","Rutherfordio","(267)",4,7], [105,"Db","Dubnio","(268)",5,7], [106,"Sg","Seaborgio","(269)",6,7], [107,"Bh","Bohrio","(270)",7,7], [108,"Hs","Hassio","(277)",8,7], [109,"Mt","Meitnerio","(278)",9,7], [110,"Ds","Darmstadtio","(281)",10,7], [111,"Rg","Roentgenio","(282)",11,7], [112,"Cn","Copernicio","(285)",12,7], [113,"Nh","Nihonio","(286)",13,7], [114,"Fl","Flerovio","(289)",14,7], [115,"Mc","Moscovio","(290)",15,7], [116,"Lv","Livermorio","(293)",16,7], [117,"Ts","Teneso","(294)",17,7], [118,"Og","Oganesón","(294)",18,7]
];

const categoryMap = { 1: 'diatomic nonmetal', 2: 'noble gas', 3: 'alkali metal', 4: 'alkaline earth metal', 5: 'metalloid', 6: 'polyatomic nonmetal', 7: 'diatomic nonmetal', 8: 'diatomic nonmetal', 9: 'diatomic nonmetal', 10: 'noble gas', 11: 'alkali metal', 12: 'alkaline earth metal', 13: 'post-transition metal', 14: 'metalloid', 15: 'polyatomic nonmetal', 16: 'polyatomic nonmetal', 17: 'diatomic nonmetal', 18: 'noble gas', 19: 'alkali metal', 20: 'alkaline earth metal', 21: 'transition metal', 22: 'transition metal', 23: 'transition metal', 24: 'transition metal', 25: 'transition metal', 26: 'transition metal', 27: 'transition metal', 28: 'transition metal', 29: 'transition metal', 30: 'transition metal', 31: 'post-transition metal', 32: 'metalloid', 33: 'metalloid', 34: 'polyatomic nonmetal', 35: 'diatomic nonmetal', 36: 'noble gas', 37: 'alkali metal', 38: 'alkaline earth metal', 39: 'transition metal', 40: 'transition metal', 41: 'transition metal', 42: 'transition metal', 43: 'transition metal', 44: 'transition metal', 45: 'transition metal', 46: 'transition metal', 47: 'transition metal', 48: 'transition metal', 49: 'post-transition metal', 50: 'post-transition metal', 51: 'metalloid', 52: 'metalloid', 53: 'diatomic nonmetal', 54: 'noble gas', 55: 'alkali metal', 56: 'alkaline earth metal', 57: 'lanthanide', 58: 'lanthanide', 59: 'lanthanide', 60: 'lanthanide', 61: 'lanthanide', 62: 'lanthanide', 63: 'lanthanide', 64: 'lanthanide', 65: 'lanthanide', 66: 'lanthanide', 67: 'lanthanide', 68: 'lanthanide', 69: 'lanthanide', 70: 'lanthanide', 71: 'lanthanide', 72: 'transition metal', 73: 'transition metal', 74: 'transition metal', 75: 'transition metal', 76: 'transition metal', 77: 'transition metal', 78: 'transition metal', 79: 'transition metal', 80: 'transition metal', 81: 'post-transition metal', 82: 'post-transition metal', 83: 'post-transition metal', 84: 'metalloid', 85: 'diatomic nonmetal', 86: 'noble gas', 87: 'alkali metal', 88: 'alkaline earth metal', 89: 'actinide', 90: 'actinide', 91: 'actinide', 92: 'actinide', 93: 'actinide', 94: 'actinide', 95: 'actinide', 96: 'actinide', 97: 'actinide', 98: 'actinide', 99: 'actinide', 100: 'actinide', 101: 'actinide', 102: 'actinide', 103: 'actinide', 104: 'transition metal', 105: 'transition metal', 106: 'transition metal', 107: 'transition metal', 108: 'transition metal', 109: 'unknown', 110: 'unknown', 111: 'unknown', 112: 'unknown', 113: 'unknown', 114: 'unknown', 115: 'unknown', 116: 'unknown', 117: 'unknown', 118: 'unknown' };
const categoryColors = { 'alkali metal': 0xED9455, 'alkaline earth metal': 0xFFBB70, 'lanthanide': 0x64C5B3, 'actinide': 0x86A789, 'transition metal': 0x4793AF, 'post-transition metal': 0x98D8AA, 'metalloid': 0xCEE6F3, 'diatomic nonmetal': 0xFFC5C5, 'polyatomic nonmetal': 0xFFEBD8, 'noble gas': 0xD0A2F7, 'unknown': 0xBFBFBF };

const shellColors = [0x00eeff, 0xffaa00, 0x88ff44, 0xff44aa, 0xaa44ff, 0x44ffbb, 0xffee44];

// --- ELEMENT DETAIL DATA ---
const electronConfig = {1:'1s¹',2:'1s²',3:'[He] 2s¹',4:'[He] 2s²',5:'[He] 2s² 2p¹',6:'[He] 2s² 2p²',7:'[He] 2s² 2p³',8:'[He] 2s² 2p⁴',9:'[He] 2s² 2p⁵',10:'[He] 2s² 2p⁶',11:'[Ne] 3s¹',12:'[Ne] 3s²',13:'[Ne] 3s² 3p¹',14:'[Ne] 3s² 3p²',15:'[Ne] 3s² 3p³',16:'[Ne] 3s² 3p⁴',17:'[Ne] 3s² 3p⁵',18:'[Ne] 3s² 3p⁶',19:'[Ar] 4s¹',20:'[Ar] 4s²',21:'[Ar] 3d¹ 4s²',22:'[Ar] 3d² 4s²',23:'[Ar] 3d³ 4s²',24:'[Ar] 3d⁵ 4s¹',25:'[Ar] 3d⁵ 4s²',26:'[Ar] 3d⁶ 4s²',27:'[Ar] 3d⁷ 4s²',28:'[Ar] 3d⁸ 4s²',29:'[Ar] 3d¹⁰ 4s¹',30:'[Ar] 3d¹⁰ 4s²',31:'[Ar] 3d¹⁰ 4s² 4p¹',32:'[Ar] 3d¹⁰ 4s² 4p²',33:'[Ar] 3d¹⁰ 4s² 4p³',34:'[Ar] 3d¹⁰ 4s² 4p⁴',35:'[Ar] 3d¹⁰ 4s² 4p⁵',36:'[Ar] 3d¹⁰ 4s² 4p⁶',37:'[Kr] 5s¹',38:'[Kr] 5s²',39:'[Kr] 4d¹ 5s²',40:'[Kr] 4d² 5s²',41:'[Kr] 4d⁴ 5s¹',42:'[Kr] 4d⁵ 5s¹',43:'[Kr] 4d⁵ 5s²',44:'[Kr] 4d⁷ 5s¹',45:'[Kr] 4d⁸ 5s¹',46:'[Kr] 4d¹⁰',47:'[Kr] 4d¹⁰ 5s¹',48:'[Kr] 4d¹⁰ 5s²',49:'[Kr] 4d¹⁰ 5s² 5p¹',50:'[Kr] 4d¹⁰ 5s² 5p²',51:'[Kr] 4d¹⁰ 5s² 5p³',52:'[Kr] 4d¹⁰ 5s² 5p⁴',53:'[Kr] 4d¹⁰ 5s² 5p⁵',54:'[Kr] 4d¹⁰ 5s² 5p⁶',55:'[Xe] 6s¹',56:'[Xe] 6s²',57:'[Xe] 5d¹ 6s²',58:'[Xe] 4f¹ 5d¹ 6s²',59:'[Xe] 4f³ 6s²',60:'[Xe] 4f⁴ 6s²',61:'[Xe] 4f⁵ 6s²',62:'[Xe] 4f⁶ 6s²',63:'[Xe] 4f⁷ 6s²',64:'[Xe] 4f⁷ 5d¹ 6s²',65:'[Xe] 4f⁹ 6s²',66:'[Xe] 4f¹⁰ 6s²',67:'[Xe] 4f¹¹ 6s²',68:'[Xe] 4f¹² 6s²',69:'[Xe] 4f¹³ 6s²',70:'[Xe] 4f¹⁴ 6s²',71:'[Xe] 4f¹⁴ 5d¹ 6s²',72:'[Xe] 4f¹⁴ 5d² 6s²',73:'[Xe] 4f¹⁴ 5d³ 6s²',74:'[Xe] 4f¹⁴ 5d⁴ 6s²',75:'[Xe] 4f¹⁴ 5d⁵ 6s²',76:'[Xe] 4f¹⁴ 5d⁶ 6s²',77:'[Xe] 4f¹⁴ 5d⁷ 6s²',78:'[Xe] 4f¹⁴ 5d⁹ 6s¹',79:'[Xe] 4f¹⁴ 5d¹⁰ 6s¹',80:'[Xe] 4f¹⁴ 5d¹⁰ 6s²',81:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹',82:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²',83:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³',84:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴',85:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵',86:'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶',87:'[Rn] 7s¹',88:'[Rn] 7s²',89:'[Rn] 6d¹ 7s²',90:'[Rn] 6d² 7s²',91:'[Rn] 5f² 6d¹ 7s²',92:'[Rn] 5f³ 6d¹ 7s²',93:'[Rn] 5f⁴ 6d¹ 7s²',94:'[Rn] 5f⁶ 7s²',95:'[Rn] 5f⁷ 7s²',96:'[Rn] 5f⁷ 6d¹ 7s²',97:'[Rn] 5f⁹ 7s²',98:'[Rn] 5f¹⁰ 7s²',99:'[Rn] 5f¹¹ 7s²',100:'[Rn] 5f¹² 7s²',101:'[Rn] 5f¹³ 7s²',102:'[Rn] 5f¹⁴ 7s²',103:'[Rn] 5f¹⁴ 6d¹ 7s²',104:'[Rn] 5f¹⁴ 6d² 7s²',105:'[Rn] 5f¹⁴ 6d³ 7s²',106:'[Rn] 5f¹⁴ 6d⁴ 7s²',107:'[Rn] 5f¹⁴ 6d⁵ 7s²',108:'[Rn] 5f¹⁴ 6d⁶ 7s²',109:'[Rn] 5f¹⁴ 6d⁷ 7s²',110:'[Rn] 5f¹⁴ 6d⁸ 7s²',111:'[Rn] 5f¹⁴ 6d⁹ 7s²',112:'[Rn] 5f¹⁴ 6d¹⁰ 7s²',113:'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹',114:'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²',115:'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³',116:'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴',117:'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵',118:'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶'};
const elementState = {1:'Gas',2:'Gas',3:'Sólido',4:'Sólido',5:'Sólido',6:'Sólido',7:'Gas',8:'Gas',9:'Gas',10:'Gas',11:'Sólido',12:'Sólido',13:'Sólido',14:'Sólido',15:'Sólido',16:'Sólido',17:'Gas',18:'Gas',19:'Sólido',20:'Sólido',21:'Sólido',22:'Sólido',23:'Sólido',24:'Sólido',25:'Sólido',26:'Sólido',27:'Sólido',28:'Sólido',29:'Sólido',30:'Sólido',31:'Sólido',32:'Sólido',33:'Sólido',34:'Sólido',35:'Líquido',36:'Gas',37:'Sólido',38:'Sólido',39:'Sólido',40:'Sólido',41:'Sólido',42:'Sólido',43:'Sólido',44:'Sólido',45:'Sólido',46:'Sólido',47:'Sólido',48:'Sólido',49:'Sólido',50:'Sólido',51:'Sólido',52:'Sólido',53:'Sólido',54:'Gas',55:'Sólido',56:'Sólido',57:'Sólido',58:'Sólido',59:'Sólido',60:'Sólido',61:'Sólido',62:'Sólido',63:'Sólido',64:'Sólido',65:'Sólido',66:'Sólido',67:'Sólido',68:'Sólido',69:'Sólido',70:'Sólido',71:'Sólido',72:'Sólido',73:'Sólido',74:'Sólido',75:'Sólido',76:'Sólido',77:'Sólido',78:'Sólido',79:'Sólido',80:'Líquido',81:'Sólido',82:'Sólido',83:'Sólido',84:'Sólido',85:'Sólido',86:'Gas',87:'Sólido',88:'Sólido',89:'Sólido',90:'Sólido',91:'Sólido',92:'Sólido',93:'Sólido',94:'Sólido',95:'Sólido',96:'Sólido',97:'Sólido',98:'Sólido',99:'Sólido',100:'Sólido',101:'Sólido',102:'Sólido',103:'Sólido',104:'Desc.',105:'Desc.',106:'Desc.',107:'Desc.',108:'Desc.',109:'Desc.',110:'Desc.',111:'Desc.',112:'Desc.',113:'Desc.',114:'Desc.',115:'Desc.',116:'Desc.',117:'Desc.',118:'Desc.'};
const meltingPoint = {1:-259.16,2:-272.2,3:180.54,4:1287,5:2075,6:3550,7:-210.0,8:-218.79,9:-219.67,10:-248.59,11:97.794,12:650,13:660.32,14:1414,15:44.15,16:115.21,17:-101.5,18:-189.34,19:63.5,20:842,21:1541,22:1668,23:1910,24:1907,25:1246,26:1538,27:1495,28:1455,29:1084.62,30:419.53,31:29.76,32:938.25,33:817,34:221,35:-7.2,36:-157.36,37:39.3,38:777,39:1526,40:1855,41:2477,42:2623,43:2157,44:2334,45:1964,46:1554.9,47:961.78,48:321.07,49:156.6,50:231.93,51:630.63,52:449.51,53:113.7,54:-111.75,55:28.44,56:727,57:920,58:795,59:935,60:1024,61:1042,62:1072,63:826,64:1312,65:1356,66:1407,67:1461,68:1529,69:1545,70:824,71:1652,72:2233,73:3017,74:3422,75:3186,76:3033,77:2446,78:1768.3,79:1064.18,80:-38.83,81:304,82:327.46,83:271.4,84:254,85:302,86:-71,87:27,88:700,89:1050,90:1750,91:1572,92:1135,93:644,94:640,95:1176,96:1340,97:986,98:900,99:860,100:1527,101:827,102:827,103:1627};
const boilingPoint = {1:-252.87,2:-268.93,3:1342,4:2470,5:4000,6:4027,7:-195.79,8:-182.96,9:-188.11,10:-246.08,11:883,12:1090,13:2519,14:3265,15:280.5,16:444.6,17:-34.04,18:-185.85,19:759,20:1484,21:2836,22:3287,23:3407,24:2671,25:2061,26:2862,27:2927,28:2913,29:2562,30:907,31:2204,32:2833,33:614,34:685,35:58.8,36:-153.22,37:688,38:1382,39:3345,40:4409,41:4744,42:4639,43:4265,44:4150,45:3695,46:2963,47:2162,48:767,49:2072,50:2602,51:1587,52:988,53:184.3,54:-108.1,55:671,56:1897,57:3464,58:3443,59:3520,60:3074,61:3000,62:1794,63:1529,64:3273,65:3230,66:2567,67:2720,68:2868,69:1950,70:1196,71:3402,72:4603,73:5458,74:5555,75:5596,76:5012,77:4428,78:3825,79:2856,80:356.73,81:1473,82:1749,83:1564,84:962,85:337,86:-61.7,87:677,88:1737,89:3200,90:4788,91:4027,92:4131,93:3902,94:3228,95:2011,96:3110};
const discoveryYear = {1:1766,2:1868,3:1817,4:1798,5:1808,6:'Antiguo',7:1772,8:1774,9:1886,10:1898,11:1807,12:1755,13:1825,14:1824,15:1669,16:'Antiguo',17:1774,18:1894,19:1807,20:1808,21:1879,22:1791,23:1801,24:1797,25:1774,26:'Antiguo',27:1735,28:1751,29:'Antiguo',30:'Antiguo',31:1875,32:1886,33:1250,34:1817,35:1826,36:1898,37:1861,38:1790,39:1794,40:1789,41:1801,42:1781,43:1937,44:1844,45:1803,46:1803,47:'Antiguo',48:1817,49:1863,50:'Antiguo',51:'Antiguo',52:1783,53:1811,54:1898,55:1860,56:1808,57:1839,58:1803,59:1885,60:1885,61:1945,62:1879,63:1901,64:1880,65:1843,66:1886,67:1878,68:1842,69:1879,70:1878,71:1907,72:1923,73:1802,74:1783,75:1925,76:1803,77:1803,78:1735,79:'Antiguo',80:'Antiguo',81:1861,82:'Antiguo',83:'Antiguo',84:1898,85:1940,86:1900,87:1939,88:1898,89:1899,90:1829,91:1913,92:1789,93:1940,94:1940,95:1944,96:1944,97:1949,98:1950,99:1952,100:1952,101:1955,102:1957,103:1961,104:1964,105:1967,106:1974,107:1981,108:1984,109:1982,110:1994,111:1994,112:1996,113:2003,114:1998,115:2003,116:2000,117:2010,118:2002};
const elementUses = {1:'Combustible de cohetes, producción de amoníaco, celdas de combustible',2:'Globos, criotecnología, soldadura',3:'Baterías de ion-litio, medicamentos psiquiátricos',4:'Aleaciones aeroespaciales, ventanas de rayos X',5:'Fibra de vidrio, semiconductores',6:'Base de la vida orgánica, diamantes, fibra de carbono',7:'Fertilizantes, explosivos, atmósfera terrestre',8:'Respiración, combustión, producción de acero',9:'Pasta dental, teflón, refrigerantes',10:'Letreros luminosos, láseres',11:'Sal de mesa, iluminación urbana',12:'Aleaciones ligeras, fuegos artificiales',13:'Latas, aviones, cables eléctricos',14:'Chips electrónicos, paneles solares, vidrio',15:'Fertilizantes, fósforos, detergentes',16:'Vulcanización del caucho, ácido sulfúrico',17:'Purificación de agua, PVC, blanqueadores',18:'Soldadura, llenado de lámparas',19:'Fertilizantes, jabones',20:'Cemento, huesos, yeso',21:'Aleaciones de alta resistencia',22:'Implantes médicos, aviones, pigmentos',23:'Acero de herramientas, resortes',24:'Acero inoxidable, cromado',25:'Acero, pilas alcalinas',26:'Construcción, maquinaria, hemoglobina',27:'Imanes, aleaciones, medicina nuclear',28:'Monedas, acero inoxidable, baterías',29:'Cables eléctricos, plomería, electrónica',30:'Galvanización, baterías, protectores solares',31:'Semiconductores, LEDs, termómetros',32:'Fibra óptica, transistores, lentes',33:'Semiconductores, insecticidas, vidrio',34:'Electrónica, fotocopiadoras, vidrio',35:'Retardantes de fuego, fotografía, medicinas',36:'Iluminación fluorescente, fotografía',37:'Celdas fotoeléctricas, relojes atómicos',38:'Fuegos artificiales, imanes de ferrita',39:'Láseres, superconductores',40:'Reactores nucleares, implantes dentales',41:'Aceros especiales, superconductores, joyería',42:'Aceros de alta resistencia, catalizadores',43:'Medicina nuclear (diagnóstico)',44:'Joyería, contactos eléctricos, catalizadores',45:'Catalizadores de autos, joyería',46:'Catalizadores, odontología, joyería',47:'Joyería, electrónica, fotografía, monedas',48:'Baterías recargables, pigmentos, aleaciones',49:'Pantallas táctiles, soldaduras, semiconductores',50:'Hojalata, soldaduras, aleaciones',51:'Retardantes de fuego, baterías, semiconductores',52:'Aleaciones, paneles solares, semiconductores',53:'Antisépticos, sal yodada, fotografía',54:'Motores iónicos, iluminación, anestesia',55:'Relojes atómicos, equipos de perforación',56:'Fuegos artificiales (verde), vidrio',57:'Óptica, baterías, catalizadores',58:'Convertidores catalíticos, vidrio, pulido',59:'Imanes de alta potencia, láseres',60:'Imanes potentes, láseres, vidrio coloreado',61:'Baterías nucleares, investigación',62:'Imanes, reactores nucleares',63:'Billetes de euro (seguridad), TV de color',64:'MRI (agente de contraste), reactores nucleares',65:'Pantallas, láseres, memorias',66:'Imanes de alto rendimiento, láseres',67:'Investigación nuclear, láseres',68:'Láseres, fibra óptica, metalurgia',69:'Rayos X portátiles, láseres',70:'Aceros inoxidables especiales',71:'PET scanners, catalizadores',72:'Reactores nucleares, aleaciones de alta temperatura',73:'Electrónica (capacitores), implantes quirúrgicos',74:'Filamentos, herramientas de corte, blindaje',75:'Contactos eléctricos, termopares, catalizadores',76:'Puntas de plumas, contactos eléctricos',77:'Bujías, crisoles, electrodos',78:'Catalizadores, joyería, equipos de laboratorio',79:'Joyería, electrónica, monedas, odontología',80:'Termómetros antiguos, amalgamas dentales',81:'Superconductores, electrónica',82:'Baterías, blindaje radiológico, soldaduras',83:'Cosméticos, medicamentos, fusibles',84:'Fuentes de calor nucleares (sondas espaciales)',85:'Investigación científica',86:'Tratamiento de cáncer (radioterapia)',87:'Investigación atómica',88:'Tratamiento de cáncer (histórico), pinturas luminosas',89:'Generadores de neutrones',90:'Reactores nucleares, lentes de cámara',91:'Investigación científica',92:'Energía nuclear, armamento, datación geológica',93:'Detectores de neutrones, naves espaciales',94:'Armas nucleares, marcapasos, sondas espaciales',95:'Detectores de humo, investigación',96:'Generadores termoeléctricos',97:'Investigación científica',98:'Tratamiento de cáncer',99:'Investigación científica',100:'Investigación científica',101:'Investigación científica',102:'Investigación científica',103:'Investigación científica',104:'Investigación',105:'Investigación',106:'Investigación',107:'Investigación',108:'Investigación',109:'Investigación',110:'Investigación',111:'Investigación',112:'Investigación',113:'Investigación',114:'Investigación',115:'Investigación',116:'Investigación',117:'Investigación',118:'Investigación'};

// --- GLOBAL VARIABLES ---
let scene, camera, renderer, controls, tableGroup, sceneContent;
let composer, bloomPass;
let raycaster, mouse, highlightedObject, selectedObject;
let audioListener, clickSound;
const originalControlsTarget = new THREE.Vector3();
let originalObjectPosition = new THREE.Vector3();

let atomicModel = null;
let orbitGroups = [];

let allCubes = [];
const originalEmissiveIntensity = new WeakMap();

// VR
let controller1, controller2;
const tempMatrix = new THREE.Matrix4();
let vrRaycaster = new THREE.Raycaster();
let isInVR = false;
let vrInfoSprite = null;

// --- INITIALIZATION ---
init();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, -500, 2200);

    // Parent group for all scene content — transformed for VR
    sceneContent = new THREE.Group();
    scene.add(sceneContent);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local-floor');
    document.getElementById('container').innerHTML = "";
    document.getElementById('container').appendChild(renderer.domElement);

    // VR Button
    document.body.appendChild(VRButton.createButton(renderer));

    // Bloom post-processing (desktop only)
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.3, 0.4, 0.55
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // HDRI environment
    const rgbeLoader = new RGBELoader();
    const loadHDRI = (url, fallbackUrl) => {
        rgbeLoader.load(url, (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;
            buildTable(texture);
        }, undefined, () => fallbackUrl && loadHDRI(fallbackUrl, null));
    };
    loadHDRI(
        'https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr',
        'https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr'
    );

    scene.background = new THREE.Color(0x050508);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);
    clickSound = new THREE.Audio(audioListener);
    new THREE.AudioLoader().load('https://threejs.org/examples/sounds/ping_pong.mp3', (buffer) => {
        clickSound.setBuffer(buffer);
        clickSound.setVolume(0.5);
    });

    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);
    document.getElementById('btn-volver').addEventListener('click', returnToGlobalView);

    // ─── VR CONTROLLERS (simple — no model factory for Quest compatibility) ──
    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onVRSelect);
    scene.add(controller1);

    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onVRSelect);
    scene.add(controller2);

    // Visible ray beams
    const rayGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -5)
    ]);
    const rayMat = new THREE.LineBasicMaterial({ color: 0x00eeff, transparent: true, opacity: 0.5 });
    controller1.add(new THREE.Line(rayGeo.clone(), rayMat.clone()));
    controller2.add(new THREE.Line(rayGeo.clone(), rayMat.clone()));

    // ─── VR SESSION LIFECYCLE ────────────────────────────────────────────────
    renderer.xr.addEventListener('sessionstart', () => {
        isInVR = true;
        // Reset selection
        if (selectedObject) {
            removeAtomicModel();
            removeVRInfoSprite();
            selectedObject.position.copy(originalObjectPosition);
            selectedObject = null;
        }
        // Scale scene to human size: table is ~2340 wide, we want ~3m → 0.0013
        sceneContent.scale.setScalar(0.0013);
        sceneContent.position.set(0, 1.3, -2.5);
    });

    renderer.xr.addEventListener('sessionend', () => {
        isInVR = false;
        removeVRInfoSprite();
        if (selectedObject) {
            removeAtomicModel();
            selectedObject.position.copy(originalObjectPosition);
            selectedObject = null;
        }
        // Restore desktop scale
        sceneContent.scale.setScalar(1);
        sceneContent.position.set(0, 0, 0);
        setTableDimmed(false);
        hideInfoPanel();
        document.getElementById('btn-volver').style.display = 'none';
    });
}

// --- SCENE BUILDING ---
function buildTable(envMap) {
    tableGroup = new THREE.Group();
    sceneContent.add(tableGroup);

    const cubeWidth = 120, cubeHeight = 120, cubeDepth = 120;
    const spacingX = 130, spacingY = 130;
    const geometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);

    for (const item of elementosData) {
        const [num, sim, nom, peso, col, row] = item;
        const posX = (col - 10) * spacingX;
        const posY = -(row - 5) * spacingY;
        const cube = crearCuboCristal(geometry, tableGroup, posX, posY, num, sim, nom, peso, envMap, row);
        allCubes.push(cube);
    }
}

function crearTexturaTexto(numero, simbolo, nombre, peso) {
    // ─── IMPROVEMENT #4: 2× resolution canvas for crisp anisotropic texture ──
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 600;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.font = 'bold 70px "Segoe UI", Arial';
    ctx.fillText(numero, 40, 100);
    ctx.textAlign = 'center';
    ctx.font = 'bold 220px "Segoe UI", Arial';
    ctx.fillText(simbolo, 256, 330);
    ctx.font = '55px "Segoe UI", Arial';
    ctx.fillText(nombre, 256, 440);
    ctx.font = 'bold 44px "Segoe UI", Arial';
    ctx.fillStyle = '#88ffff';
    ctx.fillText(peso, 256, 530);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

function crearCuboCristal(geometry, grupo, x, y, numero, simbolo, nombre, peso, envMap, periodo) {
    const texturaCaraFrontal = crearTexturaTexto(numero, simbolo, nombre, peso);
    // ─── IMPROVEMENT #4: Max anisotropy → sharp text at oblique angles ────────
    texturaCaraFrontal.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const category = categoryMap[numero] || 'unknown';
    const color = new THREE.Color(categoryColors[category]);

    // ─── IMPROVEMENT #2: Richer glass material ────────────────────────────────
    const crystalMaterial = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.15,
        roughness: 0.15,
        envMap: envMap,
        envMapIntensity: 0.4,
        transparent: true,
        opacity: 0.6,
        emissive: color,
        emissiveIntensity: 0.12,
    });

    const frontMaterial = crystalMaterial.clone();
    frontMaterial.map = texturaCaraFrontal;
    frontMaterial.emissiveIntensity = 0.06;

    const materials = [
        crystalMaterial.clone(), crystalMaterial.clone(),
        crystalMaterial.clone(), crystalMaterial.clone(),
        frontMaterial,           crystalMaterial.clone()
    ];

    // Store original intensities for dim/restore animation
    materials.forEach(mat => originalEmissiveIntensity.set(mat, mat.emissiveIntensity));

    const cubo = new THREE.Mesh(geometry, materials);
    cubo.position.set(x, y, 0);
    cubo.userData = { numero, simbolo, nombre, category, periodo };

    grupo.add(cubo);
    return cubo;
}

// --- ATOMIC MODEL ---

function getShellElectrons(atomicNumber) {
    const maxPerShell = [2, 8, 8, 18, 18, 32, 32];
    const shells = [];
    let remaining = atomicNumber;
    for (let i = 0; i < maxPerShell.length && remaining > 0; i++) {
        shells.push(Math.min(remaining, maxPerShell[i]));
        remaining -= shells[shells.length - 1];
    }
    return shells;
}

// ─── dim / restore all background cubes ────────────────────────────────────
function setTableDimmed(dimmed) {
    for (const cube of allCubes) {
        if (cube === selectedObject) continue;
        cube.material.forEach(mat => {
            const baseIntensity = originalEmissiveIntensity.get(mat) ?? 0.12;
            new TWEEN.Tween({ ei: mat.emissiveIntensity, op: mat.opacity })
                .to({ ei: dimmed ? 0.02 : baseIntensity, op: dimmed ? 0.12 : 0.6 }, 700)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(({ ei, op }) => { mat.emissiveIntensity = ei; mat.opacity = op; })
                .start();
        });
    }
    // Ramp bloom when selecting
    new TWEEN.Tween(bloomPass)
        .to({ strength: dimmed ? 0.9 : 0.3, threshold: dimmed ? 0.15 : 0.55 }, 800)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
}

// ─── INFO PANEL ────────────────────────────────────────────────────────────
function showInfoPanel(ud) {
    const num = ud.numero;
    const cat = ud.category;
    const catColor = categoryColors[cat] || 0xBFBFBF;
    const hex = '#' + new THREE.Color(catColor).getHexString();
    const peso = elementosData.find(e => e[0] === num)?.[3] ?? '—';
    const panel = document.getElementById('info-panel');
    panel.innerHTML = `
        <div class="ip-header">
            <div class="ip-symbol">${ud.simbolo}</div>
            <div>
                <div class="ip-number">#${num}</div>
                <div class="ip-name">${ud.nombre}</div>
            </div>
        </div>
        <div class="ip-category" style="background:${hex}33;color:${hex};border:1px solid ${hex}66">${cat}</div>
        <div class="ip-grid">
            <div class="ip-stat"><div class="ip-stat-label">Peso Atómico</div><div class="ip-stat-value">${peso}</div></div>
            <div class="ip-stat"><div class="ip-stat-label">Estado</div><div class="ip-stat-value">${elementState[num] ?? '—'}</div></div>
            <div class="ip-stat"><div class="ip-stat-label">P. Fusión</div><div class="ip-stat-value">${meltingPoint[num] != null ? meltingPoint[num] + ' °C' : '—'}</div></div>
            <div class="ip-stat"><div class="ip-stat-label">P. Ebullición</div><div class="ip-stat-value">${boilingPoint[num] != null ? boilingPoint[num] + ' °C' : '—'}</div></div>
            <div class="ip-stat"><div class="ip-stat-label">Descubrimiento</div><div class="ip-stat-value">${discoveryYear[num] ?? '—'}</div></div>
            <div class="ip-stat"><div class="ip-stat-label">Periodo</div><div class="ip-stat-value">${ud.periodo}</div></div>
        </div>
        <div class="ip-section-title">Configuración Electrónica</div>
        <div class="ip-uses" style="margin-bottom:10px;font-family:monospace;font-size:14px">${electronConfig[num] ?? '—'}</div>
        <div class="ip-section-title">Usos Principales</div>
        <div class="ip-uses">${elementUses[num] ?? '—'}</div>
    `;
    requestAnimationFrame(() => panel.classList.add('visible'));
}
function hideInfoPanel() {
    const panel = document.getElementById('info-panel');
    panel.classList.remove('visible');
}

function createAtomicModel(cubeMesh) {
    removeAtomicModel();

    const { numero, category } = cubeMesh.userData;
    atomicModel = new THREE.Group();
    orbitGroups = [];

    const catColor = new THREE.Color(categoryColors[category] || 0xff4400);

    // ─── NUCLEUS CLUSTER: multiple proton/neutron spheres ────────────────────
    const nucleusRadius = 5 + Math.log(numero + 1) * 2.5;
    const nucleonCount = Math.min(numero, 20);
    const nucleonGeo = new THREE.SphereGeometry(nucleusRadius * 0.55, 16, 16);

    const protonMat = new THREE.MeshPhysicalMaterial({
        color: catColor,
        emissive: catColor,
        emissiveIntensity: 3.0,
        roughness: 0.3,
        metalness: 0.2,
    });
    const neutronColor = catColor.clone().lerp(new THREE.Color(0xffffff), 0.35);
    const neutronMat = protonMat.clone();
    neutronMat.color = neutronColor;
    neutronMat.emissive = neutronColor;

    for (let n = 0; n < nucleonCount; n++) {
        const sphere = new THREE.Mesh(nucleonGeo, n % 2 === 0 ? protonMat : neutronMat);
        const a1 = Math.random() * Math.PI * 2;
        const a2 = Math.random() * Math.PI;
        const r  = Math.random() * nucleusRadius * 0.85;
        sphere.position.set(
            r * Math.sin(a2) * Math.cos(a1),
            r * Math.sin(a2) * Math.sin(a1),
            r * Math.cos(a2)
        );
        atomicModel.add(sphere);
    }

    // Pulsating point light at nucleus
    const nucleusLight = new THREE.PointLight(catColor, 3, 350);
    nucleusLight.userData.isNucleusLight = true;
    atomicModel.add(nucleusLight);

    // ─── ELECTRON SHELLS ──────────────────────────────────────────────────────
    const shellElectrons = getShellElectrons(numero);

    const tiltConfigs = [
        { x: 0,               y: 0 },
        { x: Math.PI / 2,    y: 0 },
        { x: Math.PI / 4,    y: Math.PI / 3 },
        { x: -Math.PI / 4,   y: Math.PI * 2 / 3 },
        { x: Math.PI / 3,    y: Math.PI / 6 },
        { x: -Math.PI / 6,   y: Math.PI * 5 / 6 },
        { x: Math.PI * 5/12, y: Math.PI / 4 },
    ];
    const shellRadii  = [28, 50, 72, 95, 118, 142, 166];
    const orbitSpeeds = [0.022, 0.015, 0.010, 0.007, 0.005, 0.004, 0.003];

    shellElectrons.forEach((electronCount, i) => {
        const radius     = shellRadii[i]   ?? shellRadii[shellRadii.length - 1] + i * 20;
        const tilt       = tiltConfigs[i]  ?? { x: Math.random() * Math.PI, y: Math.random() * Math.PI };
        const speed      = orbitSpeeds[i]  ?? 0.002;
        const shellColor = new THREE.Color(shellColors[i] ?? 0x00eeff);

        // ── Orbit ring: thin Line instead of fat torus ──────────────────────
        const pts = [];
        for (let s = 0; s <= 128; s++) {
            const theta = (s / 128) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
        }
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const lineMat = new THREE.LineBasicMaterial({
            color: shellColor,
            transparent: true,
            opacity: 0.22 + 0.05 * (shellElectrons.length - i),
        });
        const orbitLine = new THREE.Line(lineGeo, lineMat);
        const torusHolder = new THREE.Group();
        torusHolder.rotation.x = tilt.x;
        torusHolder.rotation.y = tilt.y;
        torusHolder.add(orbitLine);
        atomicModel.add(torusHolder);

        // ── Rotating electron group ─────────────────────────────────────────
        const orbitGroup = new THREE.Group();
        orbitGroup.rotation.x = tilt.x;
        orbitGroup.rotation.y = tilt.y;
        atomicModel.add(orbitGroup);

        const displayCount = Math.min(electronCount, 8);
        for (let e = 0; e < displayCount; e++) {
            const pivot = new THREE.Group();
            pivot.rotation.z = (e / displayCount) * Math.PI * 2;
            orbitGroup.add(pivot);

            // Electron core (MeshBasicMaterial → always fully lit for bloom)
            const electronGeo = new THREE.SphereGeometry(3.5, 16, 16);
            const electron = new THREE.Mesh(electronGeo, new THREE.MeshBasicMaterial({ color: shellColor }));
            electron.position.x = radius;
            pivot.add(electron);

            // Glow halo
            const halo = new THREE.Mesh(
                new THREE.SphereGeometry(6.5, 16, 16),
                new THREE.MeshBasicMaterial({ color: shellColor, transparent: true, opacity: 0.18 })
            );
            halo.position.x = radius;
            pivot.add(halo);
        }

        orbitGroups.push({ group: orbitGroup, speed });
    });

    // ─── SPRITE LABEL with element name ────────────────────────────────────
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512; labelCanvas.height = 128;
    const lctx = labelCanvas.getContext('2d');
    lctx.fillStyle = 'rgba(0,0,0,0)';
    lctx.fillRect(0, 0, 512, 128);
    lctx.font = 'bold 64px "Segoe UI", Arial';
    lctx.textAlign = 'center'; lctx.textBaseline = 'middle';
    lctx.fillStyle = '#ffffff';
    lctx.shadowColor = catColor.getStyle();
    lctx.shadowBlur = 18;
    const labelName = cubeMesh.userData.nombre;
    lctx.fillText(labelName, 256, 64);
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    const labelMat = new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthTest: false });
    const labelSprite = new THREE.Sprite(labelMat);
    const topY = (shellRadii[shellElectrons.length - 1] ?? 166) + 30;
    labelSprite.position.set(0, topY, 0);
    labelSprite.scale.set(120, 30, 1);
    atomicModel.add(labelSprite);

    cubeMesh.add(atomicModel);

    // Grow-in reveal
    atomicModel.scale.setScalar(0);
    new TWEEN.Tween(atomicModel.scale)
        .to({ x: 1, y: 1, z: 1 }, 900)
        .delay(400)
        .easing(TWEEN.Easing.Back.Out)
        .start();
}

function removeAtomicModel() {
    if (!atomicModel) return;
    atomicModel.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
            if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
            else child.material.dispose();
        }
    });
    if (atomicModel.parent) atomicModel.parent.remove(atomicModel);
    atomicModel = null;
    orbitGroups = [];
}

// --- EVENT HANDLERS ---

function onMouseMove(event) {
    if (selectedObject || !tableGroup) return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(tableGroup.children);
    if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (highlightedObject !== hit) { clearHighlight(); highlightObject(hit); }
    } else {
        clearHighlight();
    }
}

function onClick(event) {
    if (selectedObject || !tableGroup) return;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(tableGroup.children);
    if (intersects.length > 0) {
        selectedObject = intersects[0].object;
        originalObjectPosition.copy(selectedObject.position);
        if (clickSound.buffer) clickSound.play();
        clearHighlight();
        setTableDimmed(true);   // ─── IMPROVEMENT #5
        ejectObject(selectedObject);
    }
}

function ejectObject(object) {
    const targetPos = new THREE.Vector3(
        object.position.x,
        object.position.y,
        object.position.z + 500
    );
    new TWEEN.Tween(object.position)
        .to(targetPos, 1200)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
            createAtomicModel(object);
            if (isInVR) createVRInfoSprite(object);
        })
        .start();

    if (!isInVR) {
        new TWEEN.Tween(controls.target)
            .to(targetPos, 1200)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
        controls.minDistance = 200;
        controls.maxDistance = 1000;
        document.getElementById('btn-volver').style.display = 'block';
        showInfoPanel(object.userData);
    }
}

function returnToGlobalView() {
    if (!selectedObject) return;

    if (!isInVR) hideInfoPanel();
    removeVRInfoSprite();

    if (atomicModel) {
        new TWEEN.Tween(atomicModel.scale)
            .to({ x: 0, y: 0, z: 0 }, 400)
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(() => removeAtomicModel())
            .start();
    }
    new TWEEN.Tween(selectedObject.position)
        .to(originalObjectPosition, 1200)
        .delay(300)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();

    if (!isInVR) {
        new TWEEN.Tween(controls.target)
            .to(originalControlsTarget, 1200)
            .delay(300)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                selectedObject = null;
                controls.minDistance = 0;
                controls.maxDistance = Infinity;
                document.getElementById('btn-volver').style.display = 'none';
                setTableDimmed(false);
            })
            .start();
    } else {
        // VR: just clean up after animation
        setTimeout(() => {
            selectedObject = null;
            setTableDimmed(false);
        }, 1600);
    }
}

function highlightObject(obj) {
    if (!obj || !Array.isArray(obj.material)) return;
    highlightedObject = obj;
    obj.material.forEach(mat => mat.emissive.multiplyScalar(2.5));
}

function clearHighlight() {
    if (!highlightedObject || !Array.isArray(highlightedObject.material)) return;
    highlightedObject.material.forEach(mat => {
        mat.emissive.copy(mat.color).multiplyScalar(
            originalEmissiveIntensity.get(mat) ?? mat.emissiveIntensity
        );
    });
    highlightedObject = null;
}

// --- UTILITY & RENDER LOOP ---

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// ─── VR INFO SPRITE (3D label in VR instead of DOM panel) ────────────────────
function createVRInfoSprite(cubeMesh) {
    removeVRInfoSprite();
    const ud = cubeMesh.userData;
    const num = ud.numero;
    const peso = elementosData.find(e => e[0] === num)?.[3] ?? '—';

    const c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(8, 18, 38, 0.92)';
    ctx.roundRect(0, 0, 512, 512, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(100,220,255,0.5)'; ctx.lineWidth = 2;
    ctx.roundRect(0, 0, 512, 512, 16);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px "Segoe UI", Arial';
    ctx.textAlign = 'center';
    ctx.fillText(ud.simbolo, 256, 90);
    ctx.font = '36px "Segoe UI", Arial';
    ctx.fillStyle = '#88ddff';
    ctx.fillText(`#${num}  ${ud.nombre}`, 256, 145);
    ctx.font = '28px "Segoe UI", Arial';
    ctx.fillStyle = '#aaccdd';
    ctx.fillText(`Peso: ${peso}`, 256, 200);
    ctx.fillText(`Estado: ${elementState[num] ?? '—'}`, 256, 245);
    ctx.fillText(`Fusión: ${meltingPoint[num] != null ? meltingPoint[num] + ' °C' : '—'}`, 256, 290);
    ctx.fillText(`Ebullición: ${boilingPoint[num] != null ? boilingPoint[num] + ' °C' : '—'}`, 256, 335);
    ctx.fillText(`Descubierto: ${discoveryYear[num] ?? '—'}`, 256, 380);
    ctx.font = '22px monospace';
    ctx.fillStyle = '#66eeff';
    const config = electronConfig[num] ?? '—';
    ctx.fillText(config.length > 28 ? config.substring(0, 28) + '…' : config, 256, 430);
    ctx.font = '20px "Segoe UI", Arial';
    ctx.fillStyle = '#99bbcc';
    const uses = (elementUses[num] ?? '—');
    ctx.fillText(uses.length > 40 ? uses.substring(0, 40) + '…' : uses, 256, 475);

    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    vrInfoSprite = new THREE.Sprite(mat);
    vrInfoSprite.scale.set(300, 300, 1);
    vrInfoSprite.position.copy(cubeMesh.position);
    vrInfoSprite.position.x += 250;
    tableGroup.add(vrInfoSprite);
}

function removeVRInfoSprite() {
    if (!vrInfoSprite) return;
    if (vrInfoSprite.material.map) vrInfoSprite.material.map.dispose();
    vrInfoSprite.material.dispose();
    if (vrInfoSprite.parent) vrInfoSprite.parent.remove(vrInfoSprite);
    vrInfoSprite = null;
}

// ─── VR SELECT HANDLER ──────────────────────────────────────────────────────
let vrSelectCooldown = false;
function onVRSelect(event) {
    if (!tableGroup || vrSelectCooldown) return;
    vrSelectCooldown = true;
    setTimeout(() => { vrSelectCooldown = false; }, 500);

    const ctrl = event.target;
    tempMatrix.identity().extractRotation(ctrl.matrixWorld);
    vrRaycaster.ray.origin.setFromMatrixPosition(ctrl.matrixWorld);
    vrRaycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    if (selectedObject) {
        returnToGlobalView();
        return;
    }

    const intersects = vrRaycaster.intersectObjects(tableGroup.children);
    if (intersects.length > 0) {
        selectedObject = intersects[0].object;
        originalObjectPosition.copy(selectedObject.position);
        if (clickSound.buffer && !clickSound.isPlaying) clickSound.play();
        clearHighlight();
        setTableDimmed(true);
        ejectObject(selectedObject);
    }
}

// ─── RENDER LOOP (setAnimationLoop for WebXR compat) ────────────────────────
function animate() {
    TWEEN.update();
    // Only update OrbitControls when NOT in VR
    if (!isInVR) controls.update();

    for (const { group, speed } of orbitGroups) {
        group.rotation.z += speed;
    }

    if (atomicModel) {
        const t = performance.now() * 0.001;
        atomicModel.traverse(child => {
            if (child.isLight && child.userData.isNucleusLight) {
                child.intensity = 2.5 + Math.sin(t * 3) * 0.8;
            }
        });
    }

    // EffectComposer doesn't support WebXR stereo
    if (renderer.xr.isPresenting) {
        renderer.render(scene, camera);
    } else {
        composer.render();
    }
}
renderer.setAnimationLoop(animate);