export const strings = {
  app: {
    name: 'Fit N Cheap',
    tagline: 'Free, no-fuss road bike fit for real cyclists',
    badge: '100% In-Browser & Private',
    disclaimer:
      'Estimate only, not a professional fit. If you have pain or injury, see a bike fitter or physiotherapist.',
    privacyNote:
      'All data stays inside your browser localStorage. No accounts, no servers, no LLM, no tracking.',
  },
  nav: {
    home: 'Home',
    wizard: 'Fit Wizard',
    guide: 'Measure Guide',
    results: 'Results',
    posture: 'Posture Analysis',
    frames: 'Frame Matcher',
    saved: 'Saved Fits',
  },
  units: {
    cm: 'cm',
    in: 'in',
    switchLabel: 'Unit system',
  },
  theme: {
    toggle: 'Toggle color theme',
    light: 'Light',
    dark: 'Dark',
  },
  common: {
    back: 'Back',
    next: 'Next',
    save: 'Save',
    saved: 'Saved',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    reset: 'Reset',
    close: 'Close',
    optional: 'Optional',
    step: 'Step',
    of: 'of',
    trySample: 'Try with sample measurements',
    saveThisFit: 'Save this fit',
    print: 'Print / Save PDF',
    seeResults: 'See Fit Results',
    typicalRange: 'Typical range',
  },
  home: {
    heroTitle: 'Get dialed in without the $300 bike shop price tag.',
    heroSubtitle:
      'A straightforward step-by-step fit calculator and posture analyzer designed for everyday road riders.',
    startWizardBtn: 'Start Fit Wizard',
    howToMeasureBtn: 'How to Measure Yourself',
    explorePostureBtn: 'Analyze Posture Photo',
    features: {
      wizard: {
        title: 'Step-by-Step Measurement Wizard',
        desc: 'Clear diagrams and simple directions for measuring your body correctly at home with everyday items.',
      },
      provenFormulas: {
        title: 'Classic Cycling Formulas',
        desc: 'Calculates saddle height (LeMond & Hamley methods), reach, stack, drop, handlebar width, and crank length.',
      },
      postureAi: {
        title: 'On-Device Posture Analysis',
        desc: 'Upload a side-view photo of you on the bike. Pose detection runs locally in your browser with zero server uploads.',
      },
      frameMatcher: {
        title: 'Road Frame Matcher',
        desc: 'Compare your ideal reach and stack to road bike frames to see which sizes actually fit you.',
      },
    },
  },
  wizard: {
    title: 'Rider Measurement Wizard',
    subtitle: 'One simple step at a time. Have a tape measure, wall, and hardcover book ready.',
    restart: 'Start Over',
    quickFillSample: 'Fill Sample Rider',
    steps: {
      height: {
        title: 'Total Rider Height',
        shortDesc: 'Stand barefoot with heels and upper back flat against a wall.',
        instruction:
          'Place a flat ruler or hardcover book on top of your head level with the floor. Mark the wall and measure down to the floor.',
        fieldLabel: 'Rider Height',
        placeholder: 'e.g. 178',
      },
      inseam: {
        title: 'Inseam / Crotch Height',
        shortDesc: 'The single most critical measurement for proper saddle height.',
        instruction:
          'Stand barefoot with feet 15–20 cm apart. Pull a hardcover book spine firmly up into your crotch (mimicking saddle pressure) and measure from the book spine down to the floor.',
        fieldLabel: 'Inseam Length',
        placeholder: 'e.g. 83',
      },
      torso: {
        title: 'Torso Length',
        shortDesc: 'From the hollow of your throat to the top of your pubic bone.',
        instruction:
          'Locate the sternal notch (the small hollow dip at the base of your throat) and measure straight down to the top edge of your pubic bone.',
        fieldLabel: 'Torso Length',
        placeholder: 'e.g. 62',
      },
      arm: {
        title: 'Arm Length',
        shortDesc: 'From the bony edge of your shoulder to your wrist crease.',
        instruction:
          'Hold your arm naturally straight. Measure from the acromion (the bony ridge on top of your shoulder) down to the crease of your wrist.',
        fieldLabel: 'Arm Length',
        placeholder: 'e.g. 60',
      },
      shoulder: {
        title: 'Shoulder Width',
        shortDesc: 'Bone-to-bone width determines your ideal handlebar width.',
        instruction:
          'Have a friend locate the bony outer peaks of both shoulders (acromion processes) and measure straight across your upper back.',
        fieldLabel: 'Shoulder Width',
        placeholder: 'e.g. 42',
      },
      foot: {
        title: 'Foot Length',
        shortDesc: 'Optional: Helps evaluate shoe sizing and cleat placement.',
        instruction:
          'Step on a sheet of paper against a wall. Mark the longest toe and measure to the back of your heel. You can skip this step if you prefer.',
        fieldLabel: 'Foot Length (Optional)',
        placeholder: 'e.g. 27',
      },
      flexibility: {
        title: 'Hamstring & Spine Flexibility',
        shortDesc: 'Determines how much saddle-to-handlebar drop your body can sustain.',
        instruction:
          'Warm up lightly, keep legs straight without locking knees, and reach down toward your toes.',
        options: {
          low: {
            title: 'Limited / Stiff',
            desc: 'Fingertips reach mid-shin or just below knees (~15–20 cm from toes). Need a taller stack and minimal handlebar drop.',
          },
          medium: {
            title: 'Average / Flexible',
            desc: 'Fingertips comfortably touch toes or shoe tops. Can sustain standard road drop without straining lower back.',
          },
          high: {
            title: 'Supple / High',
            desc: 'Palms easily touch flat on the floor with straight knees. Capable of an aggressive, aerodynamic race position.',
          },
        },
      },
      ridingStyle: {
        title: 'Intended Riding Style',
        shortDesc: 'Shapes your reach, stack, and torso angle.',
        instruction:
          'Select your primary riding purpose. This fine-tunes your reach and handlebar height target.',
        options: {
          endurance: {
            title: 'Endurance / Gran Fondo',
            desc: 'Long multi-hour rides, charity events, relaxed back (~45–50°), higher bars for all-day comfort.',
          },
          balanced: {
            title: 'Balanced / Sportive',
            desc: 'All-around spirited club rides and hills (~40–45° back angle), balanced blend of speed and comfort.',
          },
          race: {
            title: 'Race / Aero Sprint',
            desc: 'Crit races, aggressive pace lines, flat back (~30–38° back angle), deep bar drop for wind penetration.',
          },
        },
      },
    },
  },
  results: {
    title: 'Your Tailored Bike Fit Blueprint',
    subtitle: 'Calculated using classic biomechanical formulas. Save or print for your next setup.',
    emptyNotice: 'No measurements found yet. Complete the wizard first.',
    saveModal: {
      title: 'Save This Fit',
      nameLabel: 'Fit Profile Name',
      namePlaceholder: 'e.g. Trek Emonda Setup / Spring 2026',
      notesLabel: 'Personal Notes (Optional)',
      notesPlaceholder: 'e.g. Using 172.5mm cranks, 20mm headset spacers...',
      confirm: 'Save Fit Profile',
      success: 'Fit saved to browser localStorage!',
    },
    sections: {
      saddle: 'Saddle Setup',
      cockpit: 'Frame & Cockpit Target',
      angles: 'Target Riding Angles',
      diagram: 'Interactive Rider Dimensions',
    },
    cards: {
      saddleHeight: {
        title: 'Saddle Height',
        explanation: 'Measured from center of bottom bracket (BB) to top of saddle along the seat tube.',
        subLeMond: 'LeMond Method (Inseam × 0.883)',
        subHamley: 'Hamley Method (Inseam × 1.09 - crank)',
        subAvg: 'Recommended Average Starting Point',
      },
      saddleSetback: {
        title: 'Saddle Setback (KOPS)',
        explanation: 'Starting guideline: knee over pedal spindle with crank horizontal at 3 o’clock.',
        note: 'Starting point only. Move saddle forward/back until hands feel light on hoods with minimal hand pressure.',
      },
      frameSize: {
        title: 'Frame Size (Seat Tube C-T)',
        explanation: 'Traditional center-to-top road frame seat tube length estimate.',
      },
      reach: {
        title: 'Target Frame Reach',
        explanation: 'Horizontal distance from bottom bracket center forward to top of headtube.',
      },
      stack: {
        title: 'Target Frame Stack',
        explanation: 'Vertical distance from bottom bracket center up to top of headtube.',
      },
      drop: {
        title: 'Saddle-to-Bar Drop',
        explanation: 'Vertical drop from saddle top down to top of handlebar clamp.',
      },
      handlebarWidth: {
        title: 'Handlebar Width',
        explanation: 'Center-to-center width at hoods, matched directly to your shoulder bone width.',
      },
      crankLength: {
        title: 'Recommended Crank Arm',
        explanation: 'Crank length tailored to your inseam to prevent excessive hip pinch at the top of the pedal stroke.',
      },
    },
    angles: {
      knee: {
        title: 'Knee Angle at 6 o’clock',
        range: '140° – 150° interior angle',
        explanation: 'Measured at bottom dead center. Prevents patellar tendon strain and hyperextension.',
      },
      back: {
        title: 'Torso Angle vs Ground',
        explanation: 'Angle of spine relative to horizontal road level.',
      },
      elbow: {
        title: 'Elbow Bend',
        range: '150° – 165° (15°–30° flexion)',
        explanation: 'Never lock elbows; a slight bend absorbs road vibration and relieves shoulder fatigue.',
      },
      shoulder: {
        title: 'Shoulder-to-Torso Angle',
        range: '80° – 95°',
        explanation: 'Arms support upper body weight without excessive reach strain.',
      },
    },
  },
  validation: {
    required: 'This field is required',
    number: 'Please enter a valid positive number',
    outOfRange:
      'This value seems outside typical range ({min} – {max} {unit}). You can proceed if accurate, but please double-check.',
    emptyStep: 'Please provide a valid measurement before continuing.',
  },
} as const;

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

export type AppStrings = DeepStringRecord<typeof strings>;

