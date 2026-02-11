export interface PrayerReading {
  id: string;
  name: string;
  arabic: string;
  indonesian: string;
  english: string;
  category: 'opening' | 'standing' | 'bowing' | 'prostration' | 'sitting' | 'closing';
  variant?: string; // For different traditions/versions
}

export const prayerReadings: PrayerReading[] = [
  // Opening
  {
    id: 'takbiratul-ihram',
    name: 'Takbiratul Ihram',
    arabic: 'اللهُ أَكْبَرُ',
    indonesian: 'Allah Maha Besar',
    english: 'Allah is the Greatest',
    category: 'opening',
  },
  {
    id: 'doa-iftitah',
    name: "Doa Iftitah",
    arabic: 'اللهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا وَسُبْحَانَ اللهِ بُكْرَةً وَأَصِيلًا. وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ. إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ. لَا شَرِيكَ لَهُ وَبِذَلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِينَ',
    indonesian: 'Allah Maha Besar dengan sebesar-besarnya, segala puji bagi Allah dengan pujian yang banyak, dan Maha Suci Allah pagi dan petang. Aku hadapkan wajahku kepada Dzat yang menciptakan langit dan bumi dengan keadaan lurus dan berserah diri, dan aku bukanlah termasuk orang-orang musyrik. Sesungguhnya shalatku, ibadahku, hidupku dan matiku hanyalah untuk Allah Tuhan semesta alam. Tidak ada sekutu bagi-Nya dan dengan demikian aku diperintahkan, dan aku termasuk orang-orang muslim.',
    english: 'Allah is the Greatest, much praise is for Allah, and glory be to Allah in the morning and evening. I have turned my face toward He who created the heavens and the earth, inclining toward truth, as a Muslim, and I am not of those who associate others with Allah. Indeed, my prayer, my rites of sacrifice, my living and my dying are for Allah, Lord of the worlds. No partner has He. And this I have been commanded, and I am of the Muslims.',
    category: 'opening',
    variant: '1',
  },
  {
    id: 'doa-iftitah-short',
    name: "Doa Iftitah",
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
    indonesian: 'Maha Suci Engkau ya Allah, dan segala puji bagi-Mu. Maha Berkah nama-Mu, Maha Tinggi keagungan-Mu, dan tidak ada Tuhan selain Engkau.',
    english: 'Glory be to You, O Allah, and praise be to You. Blessed is Your name, exalted is Your majesty, and there is no god but You.',
    category: 'opening',
    variant: '2',
  },
  {
    id: 'doa-iftitah-baid',
    name: "Doa Iftitah",
    arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ',
    indonesian: 'Ya Allah, jauhkanlah antara aku dan kesalahanku sebagaimana Engkau menjauhkan antara timur dan barat. Ya Allah, bersihkanlah aku dari kesalahan sebagaimana dibersihkan pakaian putih dari kotoran. Ya Allah, cucilah kesalahanku dengan air, salju, dan embun beku.',
    english: 'O Allah, distance me from my sins as You have distanced the east from the west. O Allah, cleanse me of my sins as a white garment is cleansed of filth. O Allah, wash my sins away with water, snow, and hail.',
    category: 'opening',
    variant: '3',
  },
  
  // Standing
  {
    id: 'al-fatihah',
    name: 'Al-Fatihah',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    indonesian: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang. Segala puji bagi Allah, Tuhan seluruh alam. Yang Maha Pengasih, Maha Penyayang. Pemilik hari pembalasan. Hanya kepada Engkau kami menyembah dan hanya kepada Engkau kami memohon pertolongan. Tunjukilah kami jalan yang lurus. Jalan orang-orang yang telah Engkau beri nikmat, bukan jalan mereka yang dimurkai, dan bukan pula jalan mereka yang sesat.',
    english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. All praise is due to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path. The path of those upon whom You have bestowed favor, not of those who have evoked Your anger or of those who are astray.',
    category: 'standing',
  },
  {
    id: 'aamiin',
    name: 'Aamiin',
    arabic: 'آمِينَ',
    indonesian: 'Kabulkanlah ya Allah',
    english: 'O Allah, accept our prayer',
    category: 'standing',
  },
  
  // Bowing (Ruku)
  {
    id: 'takbir-ruku',
    name: 'Takbir Ruku',
    arabic: 'اللهُ أَكْبَرُ',
    indonesian: 'Allah Maha Besar',
    english: 'Allah is the Greatest',
    category: 'bowing',
  },
  {
    id: 'doa-ruku',
    name: 'Doa Ruku',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ',
    indonesian: 'Maha Suci Tuhanku Yang Maha Agung dan dengan memuji-Nya (3x)',
    english: 'Glory be to my Lord, the Most Great, and praise be to Him (3x)',
    category: 'bowing',
    variant: '1',
  },
  {
    id: 'doa-ruku-v2',
    name: 'Doa Ruku',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    indonesian: 'Maha Suci Tuhanku Yang Maha Agung (3x)',
    english: 'Glory be to my Lord, the Most Great (3x)',
    category: 'bowing',
    variant: '2',
  },
  {
    id: 'itidal',
    name: "I'tidal",
    arabic: 'سَمِعَ اللهُ لِمَنْ حَمِدَهُ',
    indonesian: 'Allah Maha Mendengar orang yang memuji-Nya',
    english: 'Allah hears those who praise Him',
    category: 'bowing',
  },
  {
    id: 'doa-itidal',
    name: "Doa I'tidal",
    arabic: 'رَبَّنَا لَكَ الْحَمْدُ مِلْءَ السَّمَاوَاتِ وَمِلْءَ الْأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ',
    indonesian: 'Ya Tuhan kami, bagi-Mu segala puji, sepenuh langit dan bumi, dan sepenuh apa yang Engkau kehendaki sesudah itu',
    english: 'Our Lord, to You belongs all praise, filling the heavens and filling the earth, and filling whatever You will beyond that',
    category: 'bowing',
    variant: '1',
  },
  {
    id: 'doa-itidal-v2',
    name: "Doa I'tidal",
    arabic: 'رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
    indonesian: 'Ya Tuhan kami, dan bagi-Mu segala puji, pujian yang banyak, baik, dan penuh berkah',
    english: 'Our Lord, and to You belongs all praise, abundant, good, and blessed praise',
    category: 'bowing',
    variant: '2',
  },
  {
    id: 'doa-itidal-v3',
    name: "Doa I'tidal",
    arabic: 'رَبَّنَا لَكَ الْحَمْدُ',
    indonesian: 'Ya Tuhan kami, bagi-Mu segala puji',
    english: 'Our Lord, to You belongs all praise',
    category: 'bowing',
    variant: '3',
  },
  
  // Prostration (Sujud)
  {
    id: 'takbir-sujud',
    name: 'Takbir Sujud',
    arabic: 'اللهُ أَكْبَرُ',
    indonesian: 'Allah Maha Besar',
    english: 'Allah is the Greatest',
    category: 'prostration',
  },
  {
    id: 'doa-sujud',
    name: 'Doa Sujud',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
    indonesian: 'Maha Suci Tuhanku Yang Maha Tinggi dan dengan memuji-Nya (3x)',
    english: 'Glory be to my Lord, the Most High, and praise be to Him (3x)',
    category: 'prostration',
    variant: '1',
  },
  {
    id: 'doa-sujud-v2',
    name: 'Doa Sujud',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    indonesian: 'Maha Suci Tuhanku Yang Maha Tinggi (3x)',
    english: 'Glory be to my Lord, the Most High (3x)',
    category: 'prostration',
    variant: '2',
  },
  {
    id: 'duduk-antara-sujud',
    name: 'Duduk Antara Dua Sujud',
    arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي',
    indonesian: 'Ya Tuhanku, ampunilah aku, rahmatilah aku, cukupkanlah kekuranganku, angkatlah derajatku, berilah aku rezeki, berilah aku petunjuk, sehatkan aku, dan maafkanlah aku',
    english: 'My Lord, forgive me, have mercy on me, mend my deficiencies, elevate me, provide for me, guide me, grant me well-being, and pardon me',
    category: 'prostration',
    variant: '1',
  },
  {
    id: 'duduk-antara-sujud-short',
    name: 'Duduk Antara Dua Sujud',
    arabic: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
    indonesian: 'Ya Tuhanku, ampunilah aku, ya Tuhanku ampunilah aku',
    english: 'My Lord, forgive me, my Lord forgive me',
    category: 'prostration',
    variant: '2',
  },
  
  // Sitting (Tasyahud)
  {
    id: 'tasyahud-awal',
    name: 'Tasyahud Awal',
    arabic: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ. السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ. السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللهِ الصَّالِحِينَ. أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ',
    indonesian: 'Segala penghormatan, keberkahan, shalawat dan kebaikan hanya bagi Allah. Salam sejahtera untukmu wahai Nabi, begitu juga rahmat Allah dan berkah-Nya. Salam sejahtera untuk kami dan hamba-hamba Allah yang shaleh. Aku bersaksi bahwa tidak ada Tuhan selain Allah, dan aku bersaksi bahwa Muhammad adalah utusan Allah.',
    english: 'All greetings, blessings, prayers and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is the Messenger of Allah.',
    category: 'sitting',
  },
  {
    id: 'shalawat-nabi',
    name: 'Shalawat Nabi',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    indonesian: 'Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad dan keluarga Nabi Muhammad, sebagaimana Engkau telah melimpahkan shalawat kepada Nabi Ibrahim dan keluarga Nabi Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, limpahkanlah berkah kepada Nabi Muhammad dan keluarga Nabi Muhammad, sebagaimana Engkau telah melimpahkan berkah kepada Nabi Ibrahim dan keluarga Nabi Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.',
    english: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious. O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.',
    category: 'sitting',
  },
  {
    id: 'doa-sebelum-salam',
    name: 'Doa Sebelum Salam',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ وَمِنْ عَذَابِ الْقَبْرِ وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
    indonesian: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari siksa neraka Jahannam, dari siksa kubur, dari fitnah kehidupan dan kematian, dan dari kejahatan fitnah Dajjal.',
    english: 'O Allah, I seek refuge in You from the punishment of Hellfire, from the punishment of the grave, from the trials of living and dying, and from the evil of the trial of the Antichrist.',
    category: 'sitting',
    variant: '1',
  },
  {
    id: 'doa-sebelum-salam-v2',
    name: 'Doa Sebelum Salam',
    arabic: 'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
    indonesian: 'Ya Allah, sesungguhnya aku telah berbuat aniaya terhadap diriku dengan aniaya yang banyak, dan tidak ada yang mengampuni dosa-dosa kecuali Engkau. Maka ampunilah aku dengan ampunan dari sisi-Mu dan rahmatilah aku. Sesungguhnya Engkau Maha Pengampun lagi Maha Penyayang.',
    english: 'O Allah, I have wronged myself greatly, and none forgives sins except You. So grant me forgiveness from You and have mercy on me. Indeed, You are the Forgiving, the Merciful.',
    category: 'sitting',
    variant: '2',
  },
  {
    id: 'doa-sebelum-salam-v3',
    name: 'Doa Sebelum Salam',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    indonesian: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari siksa api neraka.',
    english: 'Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    category: 'sitting',
    variant: '3',
  },
  {
    id: 'doa-sebelum-salam-v4',
    name: 'Doa Sebelum Salam',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، وَمَا أَسْرَفْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي، أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخِّرُ، لَا إِلَهَ إِلَّا أَنْتَ',
    indonesian: 'Ya Allah, ampunilah dosaku yang telah lalu dan yang akan datang, yang kusembunyikan dan yang kunyatakan, yang kulakukan secara berlebihan, dan dosa yang Engkau lebih mengetahuinya daripada aku. Engkaulah yang mendahulukan dan mengakhirkan, tidak ada Tuhan selain Engkau.',
    english: 'O Allah, forgive me what I have sent before me and what I have kept back, what I have concealed and what I have done openly, what I have done in excess, and what You know better than I. You are the One who brings forward and the One who delays. There is no god but You.',
    category: 'sitting',
    variant: '4',
  },
  
  // Closing (Salam)
  {
    id: 'salam',
    name: 'Salam',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ',
    indonesian: 'Semoga keselamatan, rahmat Allah, dan berkah-Nya tercurah kepada kalian (kanan dan kiri)',
    english: 'Peace, mercy of Allah, and His blessings be upon you (right and left)',
    category: 'closing',
  },
];

export const categoryLabels: Record<string, { id: string; en: string }> = {
  opening: { id: 'Pembukaan', en: 'Opening' },
  standing: { id: 'Berdiri', en: 'Standing' },
  bowing: { id: 'Ruku', en: 'Bowing' },
  prostration: { id: 'Sujud', en: 'Prostration' },
  sitting: { id: 'Duduk', en: 'Sitting' },
  closing: { id: 'Penutup', en: 'Closing' },
};
