const tattingar = [
  [
    'Fåglar',
    'Tättingar',
    'Kråkfåglar',
    'Skata',
    'Pica pica',
    'male',
    'Råstasjön',
    'stockholm',
    '2009-05-15',
    'image067.jpg',
  ],
  [
    'Fåglar',
    'Tättingar',
    'Kråkfåglar',
    'Kråka',
    'Corvus corone',
    'female',
    'Råstasjön',
    'stockholm',
    '2009-05-15',
    'image068.jpg',
  ],
  [
    'Fåglar',
    'Tättingar',
    'Kråkfåglar',
    'Råka',
    'Corvus frugilegus',
    'male',
    'Verkeån',
    'skane',
    '2010-05-19',
    'image066.jpg',
  ],
  [
    'Fåglar',
    'Tättingar',
    'Kråkfåglar',
    'Lavskrika',
    'Perisoreus infaustus',
    'male',
    'Ånnsjön',
    'jamtland',
    '2010-06-16',
    'image069.jpg',
  ],
  [
    'Fåglar',
    'Tättingar',
    'Kråkfåglar',
    'Kaja',
    'Corvus monedula',
    'male',
    'Ottenby',
    'Öland',
    '2009-07-12',
    'image070.jpg',
  ],
  [
    'Fåglar',
    'Tättingar',
    'Kråkfåglar',
    'Nötskrika',
    'Garrulus glandarius',
    'male',
    'Källhagen',
    'sodermanland',
    '2018-04-28',
    'image301.jpg',
  ],

  [
    'Fåglar',
    'Tättingar',
    'Mesar',
    'Talgoxe',
    'Parus major',
    '',
    'Källhagen',
    'Sörmland',
    '2019-05-07',
    'image1003.JPG',
  ],

  [
    'Fröväxter',
    'Gömfröiga',
    'Lövträd',
    'Oxel',
    '',
    'Sorbus intermedia',
    'Högenäs orde',
    'Öland',
    '2017 -08-03',
    'image409.jpg',
  ],
  [
    'Fröväxter',
    'Gömfröiga',
    'Lövträd',
    'Rönn',
    '',
    'Sorbus aucuparia',
    'Furudal',
    'Dalarna',
    '2017-09-01',
    'image410.jpg',
  ],
];

export const defaultTatting = (id = 0) => ({
  species: tattingar[id][3],
  place: tattingar[id][6],
  date: tattingar[id][8],
  kingdom: tattingar[id][0],
  order: tattingar[id][1],
  family: tattingar[id][2],
  county: tattingar[id][7],
  speciesLatin: tattingar[id][4],
  sex: tattingar[id][5],
  image: tattingar[id][9],
});

export const csv = `Klass;Ordning;Familj;Art;Kön;Latinskt namn;Lokal;Län;Datum;Bild;Kommentar;
Fåglar;Tättingar;Kråkfåglar;Skata;;Pica pica;Råstasjön;Uppland;2009-05-15;image067.jpg;;
Fåglar;Tättingar;Kråkfåglar;Kråka;;Corvus corone;Råstasjön;Uppland;2009-05-15;image068.jpg;;
Fåglar;Tättingar;Kråkfåglar;Råka;;Corvus frugilegus;Verkeån;Skåne;2010-05-19;image066.jpg;;
Fåglar;Tättingar;Kråkfåglar;Lavskrika;;Perisoreus infaustus;Ånnsjön;Jämtland;2010-06-16;image069.jpg;;
Fåglar;Tättingar;Kråkfåglar;Kaja;;Corvus monedula;Ottenby;Öland;2009-07-12;image070.jpg;;
Fåglar;Tättingar;Kråkfåglar;Nötskrika;;Garrulus glandarius;Källhagen;Sörmland;2018-04-28;image301.jpg;;
;Tättingar;Kråkfåglar;;;;;;;;;
;Tättingar;Kråkfåglar;;;;;;;;;
Fåglar;Tättingar;Mesar;Talgoxe;;Parus major;Källhagen;Sörmland;2019-05-07;image1003.JPG;;
;Tättingar;Mesar;Blåmes;;Parus caeruleus;Djurgården;Uppland;2018-09-03;image430.jpg;;
Fåglar;Tättingar;Starar;Stare;;Sturnus vulgaris;Råstasjön;Uppland;2009-05-15;image73.jpg;;
Fåglar;Tättingar;Nötväckor;Nötväcka;;Sitta europaea;Källhagen;Sörmland;2018-08-05;image431.jpg;;
Fåglar;Andfåglar;Änder, gäss och svanar;Kanadagås;;Branta candensis;Råstasjön;Uppland;2009-05-15;image059.jpg;;
Fåglar;Andfåglar;Änder, gäss och svanar;Vitkindad gås;;Branta leucopsis;Råstasjön;Uppland;2009-05-15;image058.jpg;;
Fåglar;Andfåglar;Änder, gäss och svanar;Knölsvan;;Cygnus olor;Råstasjön;Uppland;2009-05-15;image060.jpg;;
Fåglar;Andfåglar;Änder, gäss och svanar;Snatterand;hane/hona;Anas strepera;Lötsjön;Uppland;2009-05-15;image062.jpg;;
Fåglar;Andfåglar;Änder, gäss och svanar;Storskrake;hona;Mergus merganser;Visby;Gotland;2008-06-15;image057.jpg;;
Fåglar;Andfåglar;Änder, gäss och svanar;Ejder;hona;Somateris molissima;Stora Karlsö;Gotland;2008-06-13;image061.jpg;;
Fåglar;Andfåglar;Änder, gäss och svanar;Sångsvan;;Cygnus cygnus;Söderåsen;Skåne;2010-05-22;image063.jpg;;
Fåglar;Andfåglar;Änder, gäss och svanar;Gräsand;hane;Anas platyrynchos;Söderåsen;Skåne;2010-05-22;image064.jpg;;
Fåglar;Andfåglar;Änder, gäss och svanar;Gräsand med ungar;hona;Anas platyrynchos;Långsjön;Sörmland;2020-05-27;image512.jpg;;
Fåglar;Andfåglar;Änder, gäss och svanar;Knipa;hona;Bucephala clangula;Furudal;Dalarna;2013-05-31;image065.jpg;;
Fåglar;Andfåglar;Änder, gäss och svanar;Grågås;;Anser anser;Källahamn;Öland;2018-05-25;image399.jpg;;
;Andfåglar;Änder, gäss och svanar;Vigg;hona;Ayhya fuligula;Djurgården;Uppland;2018-09-03;image429.jpg.jpg;;
;Andfåglar;Änder, gäss och svanar;Vigg;hane/hona;Ayhya fuligula;Långsjön;Sörmland;2020-04-24;image514.jpg;;`;
