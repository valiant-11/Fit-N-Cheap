import type { AppStrings } from './strings';

export const stringsTl: AppStrings = {
  app: {
    name: 'Fit N Cheap',
    tagline: 'Libre at direktang road bike fit para sa tunay na siklista',
    badge: '100% Sa-Browser at Pribado',
    disclaimer:
      'Tantiya lamang, hindi pamalit sa propesyonal na bike fit. Kung may nararamdamang sakit o pinsala, kumonsulta sa lisensyadong bike fitter o physiotherapist.',
    privacyNote:
      'Lahat ng datos ay nananatili sa localStorage ng iyong browser. Walang account, walang server, walang LLM, walang tracking.',
  },
  nav: {
    home: 'Tahanan',
    wizard: 'Fit Wizard',
    guide: 'Gabay sa Sukat',
    results: 'Resulta',
    posture: 'Pagsusuri ng Postura',
    frames: 'Pagtugma ng Frame',
    saved: 'Nai-save na Fit',
  },
  units: {
    cm: 'cm',
    in: 'pulgada',
    switchLabel: 'Sistema ng sukat',
  },
  theme: {
    toggle: 'Palitan ang tema ng kulay',
    light: 'Maliwanag',
    dark: 'Madilim',
  },
  common: {
    back: 'Bumalik',
    next: 'Kasunod',
    save: 'I-save',
    saved: 'Nai-save na',
    cancel: 'Kanselahin',
    delete: 'Burahin',
    edit: 'I-edit',
    reset: 'I-reset',
    close: 'Isara',
    optional: 'Opsyonal',
    step: 'Hakbang',
    of: 'ng',
    trySample: 'Subukan gamit ang halimbawang sukat',
    saveThisFit: 'I-save ang fit na ito',
    print: 'I-print / I-save bilang PDF',
    seeResults: 'Tingnan ang Resulta ng Fit',
    typicalRange: 'Karaniwang saklaw',
  },
  home: {
    heroTitle: 'Makuha ang tamang posisyon nang walang mahal na bayad sa bike shop.',
    heroSubtitle:
      'Isang malinaw na hakbang-hakbang na fit calculator at posture analyzer na sadyang ginawa para sa mga regular na siklista.',
    startWizardBtn: 'Simulan ang Fit Wizard',
    howToMeasureBtn: 'Paano Sukatin ang Katawan',
    explorePostureBtn: 'Suriin ang Litrato ng Postura',
    features: {
      wizard: {
        title: 'Hakbang-hakbang na Gabay sa Pagsukat',
        desc: 'Malinaw na ilustrasyon at simpleng tagubilin sa tamang pagsukat ng katawan sa bahay gamit ang karaniwang gamit.',
      },
      provenFormulas: {
        title: 'Klasikong Pormula sa Pagbibisikleta',
        desc: 'Kinakalkula ang taas ng saddle (LeMond & Hamley methods), reach, stack, drop, lapad ng manibela, at haba ng crank.',
      },
      postureAi: {
        title: 'On-Device na Pagsusuri ng Postura',
        desc: 'Mag-upload ng tagiliran na litrato habang nakasakay sa bisikleta. Tumatakbo ang pose detection sa browser mo nang walang server upload.',
      },
      frameMatcher: {
        title: 'Road Frame Matcher',
        desc: 'Ikumpara ang iyong ideal reach at stack sa mga sukat ng road frame upang malaman kung aling sukat ang tunay na babagay sa iyo.',
      },
    },
  },
  wizard: {
    title: 'Wizard sa Pagsukat ng Siklista',
    subtitle: 'Isang simpleng hakbang bawat sandali. Ihanda ang tape measure, pader, at makapal na libro.',
    restart: 'Magsimula Muli',
    quickFillSample: 'Maglagay ng Halimbawa',
    steps: {
      height: {
        title: 'Kabuuang Taas ng Siklista',
        shortDesc: 'Tumayo nang nakayapak na ang sakong at likod ay nakalapat sa pader.',
        instruction:
          'Maglagay ng tuwid na ruler o makapal na libro sa ibabaw ng ulo nang pantay sa sahig. Markahan ang pader at sukatin pababa sa sahig.',
        fieldLabel: 'Taas ng Siklista',
        placeholder: 'hal. 178',
      },
      inseam: {
        title: 'Inseam / Taas ng Singit',
        shortDesc: 'Ang pinakamahalagang sukat para sa tamang taas ng saddle.',
        instruction:
          'Tumayo nang nakayapak na may 15–20 cm ang pagitan ng mga paa. Hilahin ang likod ng makapal na libro pataas sa singit (gaya ng presyon ng saddle) at sukatin mula sa libro pababa sa sahig.',
        fieldLabel: 'Haba ng Inseam',
        placeholder: 'hal. 83',
      },
      torso: {
        title: 'Haba ng Torso (Katawan)',
        shortDesc: 'Mula sa uka ng lalamunan hanggang sa itaas ng pubic bone.',
        instruction:
          'Hanapin ang sternal notch (ang maliit na uka sa ilalim ng lalamunan) at sukatin nang deretso pababa sa ibabaw ng pubic bone.',
        fieldLabel: 'Haba ng Torso',
        placeholder: 'hal. 62',
      },
      arm: {
        title: 'Haba ng Braso',
        shortDesc: 'Mula sa buto ng balikat hanggang sa linya ng pulso.',
        instruction:
          'Panatilihing tuwid ang braso nang natural. Sukatin mula sa acromion (ang matigas na buto sa ibabaw ng balikat) hanggang sa lukot ng pulso.',
        fieldLabel: 'Haba ng Braso',
        placeholder: 'hal. 60',
      },
      shoulder: {
        title: 'Lapad ng Balikat',
        shortDesc: 'Ang lapad mula buto-sa-buto ang batayan ng tamang lapad ng manibela.',
        instruction:
          'Ipasuri sa kasama ang matutulis na buto sa magkabilang balikat (acromion) at sukatin nang tuwid sa likod.',
        fieldLabel: 'Lapad ng Balikat',
        placeholder: 'hal. 42',
      },
      foot: {
        title: 'Haba ng Paa',
        shortDesc: 'Opsyonal: Tumutulong sa pagtukoy ng sukat ng sapatos at posisyon ng cleat.',
        instruction:
          'Tumuntong sa papel na nakadikit sa pader. Markahan ang dulo ng pinakamahabang daliri at sukatin hanggang sa likod ng sakong. Pwedeng laktawan ito kung nais.',
        fieldLabel: 'Haba ng Paa (Opsyonal)',
        placeholder: 'hal. 27',
      },
      flexibility: {
        title: 'Flexibility ng Hamstring at Likod',
        shortDesc: 'Nagtatakda kung gaano kalalim na handlebar drop ang kayang tiisin ng katawan.',
        instruction:
          'Mag-warm up nang bahagya, panatilihing tuwid ang tuhod nang hindi pinipilit, at abutin ang mga daliri sa paa.',
        options: {
          low: {
            title: 'Medyo Matigas / Limited',
            desc: 'Umaabot lamang ang mga daliri sa gitna ng binti o ilalim ng tuhod (~15–20 cm mula sa paa). Nangangailangan ng mas mataas na stack at kaunting drop.',
          },
          medium: {
            title: 'Katamtaman / Flexible',
            desc: 'Komportableng naaabot ang mga daliri ng paa o ibabaw ng sapatos. Kayang magpatakbo ng standard road drop nang walang ngalay sa likod.',
          },
          high: {
            title: 'Napakalambot / High',
            desc: 'Madaling nakalapat ang mga palad sa sahig nang tuwid ang mga tuhod. May kakayahan sa agresibo at aerodynamic na posisyon sa karera.',
          },
        },
      },
      ridingStyle: {
        title: 'Estilo ng Pagsakay',
        shortDesc: 'Bumubuo sa iyong target na reach, stack, at anggulo ng katawan.',
        instruction:
          'Piliin ang iyong pangunahing layunin sa pagsakay upang maiakma ang taas ng manibela at layo ng reach.',
        options: {
          endurance: {
            title: 'Endurance / Gran Fondo',
            desc: 'Mahahabang oras ng padyak, charity rides, nakarelaks na likod (~45–50°), mas mataas na manibela para sa buong araw na ginhawa.',
          },
          balanced: {
            title: 'Balanced / Sportive',
            desc: 'Pangkalahatang club rides at ahon (~40–45° anggulo ng likod), balanseng kombinasyon ng bilis at ginhawa.',
          },
          race: {
            title: 'Race / Aero Sprint',
            desc: 'Karera, mabilisang pace line, patag na likod (~30–38° anggulo), malalim na bar drop para sa hangin.',
          },
        },
      },
    },
  },
  results: {
    title: 'Ang Iyong Pasadyang Bike Fit Blueprint',
    subtitle: 'Kinakalkula gamit ang klasikong biomechanical na pormula. I-save o i-print para sa iyong susunod na setup.',
    emptyNotice: 'Wala pang nakitang sukat. Tapusin muna ang wizard.',
    saveModal: {
      title: 'I-save ang Fit na Ito',
      nameLabel: 'Pangalan ng Profile ng Fit',
      namePlaceholder: 'hal. Trek Emonda Setup / Tag-araw 2026',
      notesLabel: 'Personal na Tala (Opsyonal)',
      notesPlaceholder: 'hal. Gamit ang 172.5mm crank, 20mm headset spacers...',
      confirm: 'I-save ang Profile',
      success: 'Nai-save ang fit sa browser localStorage!',
    },
    sections: {
      saddle: 'Posisyon ng Saddle',
      cockpit: 'Target sa Frame at Cockpit',
      angles: 'Target na Anggulo sa Pagsakay',
      diagram: 'Interaktibong Sukat ng Siklista',
    },
    cards: {
      saddleHeight: {
        title: 'Taas ng Saddle',
        explanation: 'Sinusukat mula sa gitna ng bottom bracket (BB) hanggang sa tuktok ng saddle sa linya ng seat tube.',
        subLeMond: 'Paraang LeMond (Inseam × 0.883)',
        subHamley: 'Paraang Hamley (Inseam × 1.09 - crank)',
        subAvg: 'Inirerekomendang Karaniwang Panimula',
      },
      saddleSetback: {
        title: 'Saddle Setback (KOPS)',
        explanation: 'Panimulang gabay: tuhod sa ibabaw ng pedal spindle kapag pahalang ang crank sa alas-3.',
        note: 'Panimula lamang. Iurong o isulong ang saddle hanggang maging magaang ang pakiramdam sa mga kamay.',
      },
      frameSize: {
        title: 'Sukat ng Frame (Seat Tube C-T)',
        explanation: 'Tradisyonal na tantiya ng seat tube mula gitna hanggang itaas (center-to-top).',
      },
      reach: {
        title: 'Target Frame Reach',
        explanation: 'Pahalang na distansya mula sa gitna ng bottom bracket pasulong hanggang sa itaas ng headtube.',
      },
      stack: {
        title: 'Target Frame Stack',
        explanation: 'Patayong distansya mula sa gitna ng bottom bracket pataas hanggang sa itaas ng headtube.',
      },
      drop: {
        title: 'Saddle-to-Bar Drop',
        explanation: 'Patayong pagbaba mula sa ibabaw ng saddle pababa sa clamp ng handlebar.',
      },
      handlebarWidth: {
        title: 'Lapad ng Manibela',
        explanation: 'Lapad mula gitna-hanggang-gitna sa hoods, na iniakma direkta sa lapad ng buto ng balikat.',
      },
      crankLength: {
        title: 'Inirerekomendang Haba ng Crank',
        explanation: 'Haba ng crank arm na iniakma sa inseam upang maiwasan ang paninikip ng balakang sa tuktok ng padyak.',
      },
    },
    angles: {
      knee: {
        title: 'Anggulo ng Tuhod sa alas-6',
        range: '140° – 150° panloob na anggulo',
        explanation: 'Sinusukat sa pinakailalim ng padyak. Pumipigil sa strain ng patellar tendon at sobrang pagtuwid.',
      },
      back: {
        title: 'Anggulo ng Torso vs Lupa',
        explanation: 'Anggulo ng likod kaugnay sa patag na kalsada.',
      },
      elbow: {
        title: 'Baluktot ng Siko',
        range: '150° – 165° (15°–30° flexion)',
        explanation: 'Huwag i-lock ang mga siko; ang bahagyang baluktot ay sumisipsip ng tagtag at pumapawi sa ngalay.',
      },
      shoulder: {
        title: 'Anggulo ng Balikat-sa-Torso',
        range: '80° – 95°',
        explanation: 'Sumusuporta ang mga braso sa bigat ng itaas na katawan nang hindi sumosobra ang reach.',
      },
    },
  },
  validation: {
    required: 'Kinakailangan ang field na ito',
    number: 'Mangyaring maglagay ng wastong positibong numero',
    outOfRange:
      'Tila labas ang halagang ito sa karaniwang saklaw ({min} – {max} {unit}). Maaaring magpatuloy kung sigurado, ngunit pakitiyak.',
    emptyStep: 'Mangyaring maglagay ng wastong sukat bago magpatuloy.',
  },
};
