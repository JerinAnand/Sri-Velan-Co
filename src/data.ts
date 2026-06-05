/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectItem, EquipmentItem, ReliefEvent, OfficeLocation } from './types';

export const COMPANY_DETAILS = {
  name: 'Sri Velan & Co',
  legalName: 'SRI VELAN & CO',
  tagline: 'Powered by Trust, Proven by Provision',
  motto: 'Precision Engineering & Corporate Infrastructure Delivery',
  yearEstablished: 2006,
  incorporationHistory: 'Founded in 2006 in Villupuram, Tamil Nadu, Sri Velan & Co has grown into a leading contracting and infrastructure enterprise accredited by state departments, delivering complex civil contracts, water resource networks, and state-of-the-art heavy dewatering services.',
  gstin: '33ABFFS6298G1ZU',
  msme: 'UDYAM-TN-31-0046742',
  brochureLink: 'https://drive.google.com/file/d/1yu8HZ3-IJyMsoSwUTJXvZQvFvmV-ftVV/view?usp=drive_link',
  instagramUrl: 'https://www.instagram.com/sri_velan_co?igsh=aTV3eWthZ3lqZXBq',
  phones: ['+91 98942 18243', '+91 98427 18243'],
  emails: [
    'srivelan2004@gmail.com',
    'pgselva45@gmail.com'
  ],
  leadership: {
    governingPartner: {
      name: 'Mr. G. Selva Kumar',
      role: 'Governing Partner & Managing Director',
      bio: 'With over two decades of robust experience in civil contracting and disaster dewatering services across Tamil Nadu, Mr. Selva Kumar leads the engineering team with a relentless commitment to execution precision, compliance, and rapid community rescue response during environmental emergencies.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtJTJScjD1s9E1gXlzJfWddGbDvVSX1Eh7cDvjCoMr81sYw4pZArZnM0ZZ5oUtaoYur4V-yYXukv1kqHT3iECpg-9uMT3_3nK--tX8irTP9bA1AqCrBte1YO4Y6B6N4nWLywI4REBwFYf3jWP06osetab2iwqHgbxlAtMw28gMhwsSOAPOYu6PUop4hoFmfDsOOKpzbR2ap4Vddzy_0StLNZTEukavQNu0eoyvd2lzSCIIPGj-1VOMPHDnK5ZNDb3ZvNYdJARXSVjN'
    }
  }
};

export const OFFICES: OfficeLocation[] = [
  {
    name: 'Head Office (Villupuram)',
    addressLines: [
      '2/112 Post Office Street,',
      'Pillur, Viluppuram,',
      'Tamilnadu - 605103.'
    ],
    mapsUrl: 'https://maps.app.goo.gl/88AVP6JFJQgCKwfn6',
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWaZ5j0JQa_hMaiCKyeQve24BFVG5pM8-47WVIGaZMPzxL0NzAEb4HS1YpGk0tmZ2QfaUXkcMfs_QeX50BBR4FF1j_ZClAJU9iBTyJcoYcDFYyspjBlT3IeHNGvAQ6XzIOxl4E8gAuY3ceiiUMWhLEmknQA6htHnYYA62oTYFoUp-QyrULQJBdvv8XjKIiaqfu_r3A-hAGgM81ngZP7N56T0gbhLIarEDGUt5fpsMqJ3ASk-uHA-TQseLbPoaawNi_4J_-baZrBKWN',
    type: 'Head Office'
  },
  {
    name: 'Chennai Corporate Office',
    addressLines: [
      'S2, Second Floor, A Block, 8th Cross Street,',
      'Ram Nagar South, Madipakkam,',
      'Chennai, Tamilnadu - 600091.'
    ],
    mapsUrl: 'https://maps.app.goo.gl/HUiiXXi5owq35epS7',
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2nREEnf-Km7RwARa7rHq0dbyzwpgHU27GkuTXW77MB7IO5NCKFqu5GIL5RyZ-bDbNlphJFil7fB9ewappZM28v0Yr6Bnti-J2_eYe7NXTeTJchwQFEDKCQ20XVGLlly4wSqgF8G97G0xJZS3s7xMW-TbiU_h91Qwjhn-wUBdcNDiT17fIHaP4tbDewpuk8AAG6rVLj0pfLj8uEotODxpzvXZHXKehW5XWMc1piA2N5zVMpRr9fKzzZdWjorUYwdXDj_4pKmletWZg',
    type: 'Chennai Office'
  }
];

export const SERVICE_CATEGORIES = [
  {
    id: 'pwd-buildings',
    title: 'PWD Buildings & Institutional Construction',
    shortDescription: 'Constructing robust state office complexes, residential campuses, and institutional quarters in compliance with absolute departmental precision codes.',
    fullDescription: 'Our group is recognized for building resilient public infrastructure including administrative complexes, school campuses, healthcare facilities, and government housings. Every structure is engineered to withstand modern seismic and climatic variations with zero performance compromises.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK_bu3E2eTRWLjgafWhf9bOZLuHqdot7H5WSM93CAJX7nMvM9Fty8GZDgrMx6eNWZKenj6QIipjw1oA4zaOBskKBz7WcaoTKBg1s1RTXIKFr8K84CxNSjpD4Lu2IZ_Xi61jCzNWNfbBvcLQ55aFy8L8hgkylmQxFTfd-5Gle-M9pgdYML2f4flRzPefmGt-I7EqcosyMkqeX5zhdoVLmhiIHmAIfrCWoeDiK0g6dybplX21LQwD16s9fOIr8Sz5RO7lSXKTMDGFQ',
    highlights: ['Superior RCC Framed Structures', 'PWD standard materials & vetting', 'On-time delivery schedules', 'Certified technical supervisors']
  },
  {
    id: 'wrd-projects',
    title: 'Water Resources Department (WRD) Networks',
    shortDescription: 'Constructing canal channels, heavy brick masonry, stone pitched revetments, and state water flow management structures.',
    fullDescription: 'We specialize in water resource infrastructure. From digging massive dynamic distribution main canals, constructing concrete structural spillways, to reinforcing bank stability through top-tier stone pitching and concrete retaining walls, we help secure agricultural irrigator routes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtF7lQsjygWGM_wckM4HW-z2nj4oRbJglwvqyPrBOopVct0FaNayNZmcV2KclNO_D91euKAKDATiy4EK6o8y08eifUUdU9GA78MFSpP7NkllTKFnMKwV2APckmltuCrXUOQ2QX-mPrSukG22c432b0rw_ra7cIVWQ5YMRbkiKoaxjYQSkKOA0fHzRDt2xaNGGRmo0bxs0IfA74U3H4Ui_SKCTZsfqfa5zC0T4xCPuTqFNiP7LpEsi5NCEKk8KnMbTz7GUcXkKOd5t1',
    highlights: ['Irrigation Canal Earthworks', 'Concrete Retaining Structures', 'Stone pitched protective embankments', 'Masonry weirs and distribution boxes']
  },
  {
    id: 'rural-development',
    title: 'Rural Reconstruction & Arterial Roads',
    shortDescription: 'Erecting fully durable, high-grade rural bituminous pavements, concrete linkways, and culvert junctions.',
    fullDescription: 'Enabling dynamic regional connectivity by constructing long-lasting concrete and asphalt road corridors, heavy box culverts for surface water crossings, and concrete retaining walls matching M30/M40 specifications designed for village routes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxiIxXaP9soAHm6-AUxFu9k89Az7nDFLazdwJh_z3UFdWCCQ2CmObJ9Llgwyd9kdp4rtRZ3M9NoGTscfFyQyKwUmpwD-BxDY6k3vWRGa-UvbVy12oEPIUtYhVtX8xZs_gJZ6XlNrtDyEmLPtpX2GEYQQ12yMzuQLhAhsrPb-v8zRuPjE_hCXHKjRCG2ahP8DkHzcKVWZapAkQUP7K0x3rOWO5m-ve244E0MBc3M34GDCkLM3OKPTjtsgxG0HXa6X6mGx75-g1oHQ',
    highlights: ['State-of-the-Art Asphaltic Paving', 'Heavy Box Culvert Engineering', 'Rigid Cement Concrete Roads (CC Roads)', 'Precast road drainage channels']
  },
  {
    id: 'urban-development',
    title: 'Urban Water Drainage & Multi-Utility Corridors',
    shortDescription: 'Building massive multi-chamber concrete storm water tunnels and heavy structural channels inside metropolitan rings.',
    fullDescription: 'Designing and executing reinforced concrete storm water systems beneath urban limits to prevent chronic waterlogging: placing precast heavy box conduits and casting in-situ dynamic storm trunks engineered for multi-ton vehicle traffic crossings.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzVcCNZihW6w169lfIKDunetwUpaeQBJlslsnhYU8tcyFXCmJqsOWqUvMF1o5VorB3d_PSuOreNl-plMpli1oGi1qmWsiXZFA_oKLjnimCDGd7s3j6p6tzu_poy4eSRxjFTSGu_hACglMnm80_-LAbSVj2Qu_Uj6a31QmfFH5ysCNp32bAg-VFF1BLn4M1VZNpJoLlGCquBh42bfpCt6SQQGd1U5XT-n8oyNpZC7tvv8_pPzPwzm6CLDCrkLdW4UTyglOhOgtEYg',
    highlights: ['High-Strength RCC Drain Channels', 'Precast Conduit Placements', 'Structural Manhole & Junction boxes', 'System Integration & Utility relocations']
  },
  {
    id: 'flood-relief',
    title: 'Disaster Relief & Heavy Dewatering Operations',
    shortDescription: 'The foremost deployment partner in South India for heavy dewatering systems, rapid canal breaching responses, and flood management.',
    fullDescription: 'Our emergency fleet operates around the clock during severe environmental storms across Chennai and coastal regions. Guided by expert technical engineers, we deploy extremely high-volume custom dewatering setups (up to 100 HP) and heavy earth movers to safeguard civilians and city grids.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYKfiwAnr8tSFNjZj_XSzajQQvnAVzDU79fw73VK9DcbcAJAz2le3lr5e6XhpkbK0bStuz2LU6hPoCoBytCVOO1Id0NA5xI_ye_kSutkyrbLNS86LKr68hdy6Z5EW5Chlp5Y4BhprAchhgtOexFV6eWL5-WSI7RYWV96iLGl5czosEa5AlEQR6Cro_id1zSO760qRM0awrOHnTn5aGlACqvBLkccoIBSTozM-SoG1s7yG5I_T_T7KbRDPh8-Tl0xs_QPlVrXdxEq8w',
    highlights: ['4", 6" Air-Assist Vacuum Dewatering Pumps', 'High capacity 100 HP Submersible Dewatering Units', 'Rapid canal breach sandbagging and earthworks', 'Continuous 24/7 operator supervision']
  },
  {
    id: 'civil-engineering',
    title: 'Comprehensive Structural Civil Engineering',
    shortDescription: 'Specialized foundational piling, retaining frameworks, heavy industrial floor slabs, and high-spec masonry.',
    fullDescription: 'Executing deep pile foundations, highly integrated brick masonry complexes, protective grade beams, and heavy architectural load-bearing columns. Every design incorporates high-durability concrete matrices, ensuring lasting performance in highly corrosive saline coastal environments.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsLe8RVCX-svxbnqxFJ_BPhxbnekwLOEgfVlyQzSrhvDeUt8fIVs9SucJNQthvJzl0Zd0k8ayEQyIMdk-yMQTZ-VCfgG6s2Pt0mqNSyWMOYliYNkWQUN7Z-utomnPg8ZXDSeXgpPMcrAxVHUxYD347dQz5u9vn8IDBkjE2KGkITZu1zt3pI_V_6J28abZWLv2kZNmwa9YQ2x3tJroBG1NzIXu-mD4uXsLMWZTzJmVk8tk7_gF0AlF8gcG-_gALsq-UwfoR9L4QPg',
    highlights: ['Deep Foundational Engineering', 'Reinforced Retaining Frameworks', 'Industrial Base Floor slabs', 'Precision Temple Masonry / HR&CE standards']
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'proj-temple',
    title: 'HR & CE Temple Masonry and Reconstruction',
    category: 'government',
    description: 'Heritage restoration, structural lining, and brick-masonry works executed under the Tamil Nadu Government Hindu Religious and Charitable Endowments (HR & CE) standards.',
    image: new URL('./assets/images/temple_restoration_masonry_1780693655082.png', import.meta.url).href,
    details: [
      'Preserved centuries-old load-bearing masonry walls',
      'Employed custom mortar compositions meeting strict governmental conservation directives',
      'Completed intricate masonry carvings and granite floor placements',
      'Rebuilt outer safety enclosures and water tanks (Theertha Kulam)'
    ]
  },
  {
    id: 'proj-pwd',
    title: 'PWD Administrative Office Complex & Quarters',
    category: 'infrastructure',
    description: 'A multi-story Reinforced Concrete Framed structure built to harbor municipal administrative bureaus with top-tier finishing standards and materials.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByChSCbaHuzLiyF4g_ttwxK4IAuAOtKMVWVCYkFP_yKUlRHVww3B8_qxzUAhh1tRaO96_OdlpK3YL_noLV5-jnLkX4okVcQ13FcjArdHc4FPvBFTS51siyiuFnAVQtsbxFRhUyQx9XAV0cgzxWuM1SrbzRaw3pW09j1140tbRNQuK1dQuExnHNxJUzjA1HYEfwRmMIkBbFrPJcRCKoTBV5gnx4C1Piyv8Sfj7IYKLGvVR0gyp4pAKv9sUSU1Sx5qmLFt0lBklGLg',
    details: [
      'Completed over 45,000 sq ft of high-finishing workspaces on time',
      'Executed earthquake-resistant structural designs verified by chief PWD engineers',
      'Integrated energy-efficient structural glass facades and ventilation corridors',
      'Fitted high-capacity rain containment basins and fire-suppression layouts'
    ]
  },
  {
    id: 'proj-wrd',
    title: 'River Channel Embankments & Stone Pitching',
    category: 'water-resource',
    description: 'Protecting municipal irrigation and flood-prone channels from erosion utilizing engineered stone structures and layout lining.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpMkTnH-NP_DXkdDNw9k7WiWn-uUkqrVTVCY-czLfTgstuhggVNoDbD61phtDD1gE8Ofc_2WtEgH7WqXEn2v1ZJqfjGFLFM8jVMbj93XdgeEZWLNlamcrZTWbEh8W_JSqNLmOL8I25Ic7ra2p-0_17ujr3q7E-tgoopaJFsDjMrgPaJux-YUI_U_i1zT2lOdELnChrLd_d8nJxPu023gUVxaxthtQL-qrv6Cj_Dzn6JuLS3o_d5FOm4ssRL3C_TVuPmOsVXWJXIA',
    details: [
      'Reinforced over 12 kilometers of sensitive rural riverbanks',
      'Crafted high-density cement-stone dry masonry structures to slow fast canal torrents',
      'Reduced mud erosion and loss of precious agricultural borderlands by 94%',
      'Deployed a fleet of 15 heavy excavators for high-accuracy canal desilting and leveling'
    ]
  },
  {
    id: 'proj-relief-fengal',
    title: 'Operation Cyclone Fengal — Dynamic Mass Dewatering',
    category: 'emergency-relief',
    description: 'Rapid response dewatering and canal reinforcement operation carried out under urgent administrative directives during Cyclone Fengal in Chennai and coastal suburbs.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYKfiwAnr8tSFNjZj_XSzajQQvnAVzDU79fw73VK9DcbcAJAz2le3lr5e6XhpkbK0bStuz2LU6hPoCoBytCVOO1Id0NA5xI_ye_kSutkyrbLNS86LKr68hdy6Z5EW5Chlp5Y4BhprAchhgtOexFV6eWL5-WSI7RYWV96iLGl5czosEa5AlEQR6Cro_id1zSO760qRM0awrOHnTn5aGlACqvBLkccoIBSTozM-SoG1s7yG5I_T_T7KbRDPh8-Tl0xs_QPlVrXdxEq8w',
    details: [
      'Deployed 34 heavy diesel pumps (6" and 10" vacuum assist) to clear subways and low-lying sectors',
      'Maintained round-the-clock shift pumping across 4 extreme nodes (over 80 million liters/day)',
      'Constructed immediate emergency sandbag weirs across canal breach zones to stop river spillovers',
      'Commended by District Authorities for rapid drainage response, saving local industrial yards'
    ]
  }
];

export const EQUIPMENTS: EquipmentItem[] = [
  {
    id: 'eq-broomer',
    name: 'Tractor-Mounted Hydraulic Broomer',
    category: 'tractor-mounted',
    iconName: 'BroomIcon',
    description: 'Our proprietary hydraulic-driven sweeping machinery customized for swift dust-free cleaning of newly paved highways, airports, and construction terminals.',
    specs: {
      'Sweeping Width': '1800 mm to 2200 mm',
      'Brush Bristles': 'High-tensile abrasive-resistant steel & heavy-duty nylon blend',
      'Operating Pressure': '160 - 180 Bar',
      'Sweeping Output': 'Up to 10,000 square meters per hour',
      'Mounting Support': 'Universal 3-Point Category-II Hitch for 40HP+ Tractors',
      'Hydraulic Flow': '45 - 60 Liters per minute'
    }
  },
  {
    id: 'eq-pump-6',
    name: 'Heavy-Duty 6-Inch Vacuum Dewatering Pump',
    category: 'tractor-mounted',
    iconName: 'PumpIcon',
    description: 'Advanced non-clog self-priming dynamic pump sets crafted to extract sediment-rich stormwater, slush, and heavy mud rapidly from critical municipal basins.',
    specs: {
      'Maximum Discharge Capacity': 'Up to 340 cubic meters per hour',
      'Priming Speed': 'Less than 12 seconds (Dry vacuum assist technology)',
      'Solid Handling Diameter': 'Up to 75 mm compressible solids',
      'Prime Mover Engine': 'Multi-cylinder water-cooled heavy duty diesel engine (45 HP)',
      'Fuel Autonomy': 'Up to 24 hours of continuous peak pumping per fill'
    }
  },
  {
    id: 'eq-excavator',
    name: 'All-Terrain Earth Movers & Excavators',
    category: 'earth-moving',
    iconName: 'ExcavatorIcon',
    description: 'Equipped with heavy bucket extensions, long-reach arms, and specialized trenchers for water resources, de-silting, and rapid relief breach plugging.',
    specs: {
      'Tonnage Class': '12 Ton to 22 Ton High-Performance Track Crawlers',
      'Attachment Outfits': 'Long-reach arms (up to 15 meters), Trenchers, Rock Breakers, River Grabbers',
      'Engine Output': '110 HP to 148 HP heavy-diesel drive',
      'Bucket Volume Capacity': '0.9 to 1.2 cubic meters heavy-duty steel'
    }
  },
  {
    id: 'eq-pump-100hp',
    name: '100 HP High-Voltage Submersible Dewatering Units',
    category: 'earth-moving',
    iconName: 'ElectricalIcon',
    description: 'Massive vertical submersibles designed to carry severe vertical fluid lifts during major dam and metro construction operations where gravity runoffs are not possible.',
    specs: {
      'Total Dynamic Head (TDH)': 'Up to 45 meters vertical lift capacity',
      'Power requirement': '100 HP, 3-Phase, 415 Volts industrial line source',
      'Impeller build': 'Double-vane high-chrome wear resistant steel alloys',
      'Weight & Anchor': 'Up to 1.2 tonnes securely anchored with steel heavy slings'
    }
  }
];

export const CYCLONE_RELIEF_TIMELINE: ReliefEvent[] = [
  {
    year: '2024',
    title: 'Cyclone Fengal Severe Storm Relief',
    description: 'Deployed the complete dewatering fleet across Southern Chennai and Villupuram coordinates to tackle record precipitation over 36 hours. Secured local highways and commercial subways in record time.',
    stats: '120 Million Liters',
    statLabel: 'Total Discharged Fluid',
    quote: 'The team worked round-the-clock during Fengal. Our custom 6" diesel vacuum pumps proved indestructible against the constant mud slush.'
  },
  {
    year: '2023',
    title: 'Cyclone Michaung Heavy Flooding Support',
    description: 'Assisted metropolitan agencies with heavy submersibles and dual tractor pump units to restore electrical substations and bypass blockages in key arterial channels.',
    stats: '36 Deployed Pumps',
    statLabel: 'Fleet Size in Action',
    quote: 'Restored the main Madipakkam electrical utility grid node in just 14 hours by bypassing a major storm drain collapse.'
  },
  {
    year: '2021',
    title: 'Cyclone Gulab Rapid Response Operations',
    description: 'Constructed an immediate 200-meter sandbag bypass channel on a broken river tributary during torrential rainfall, safely routing floodwaters away from rural agricultural villages.',
    stats: '2,500 Sandbags',
    statLabel: 'Rapid Embankment Placed',
    quote: 'Managed to seal a 12-meter river breach under Mr. Selva Kumar\'s direct line supervision, safeguarding 400 families from overnight submersion.'
  },
  {
    year: '2020',
    title: 'Cyclone Nivar Dewatering Operations',
    description: 'Mobilized massive tractor-mounted dewatering pumps and high-head submersibles to drain out subterranean parking levels and structural foundations of government institutional complexes.',
    stats: '72 Hours',
    statLabel: 'Continuous Operation',
    quote: 'Eradicated deep stagnant basins that threatened foundational grade beams of newly structured government administrative blocks.'
  }
];
