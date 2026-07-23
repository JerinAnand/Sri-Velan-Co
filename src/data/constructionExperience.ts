import { ConstructionCategory } from '../types';

import pwdImg from '../assets/images/construction/pwd-buildings.jpg';
import wrdImg from '../assets/images/construction/wrd-works.jpg';
import ruralImg from '../assets/images/construction/rural-department.jpg';
import hrceImg from '../assets/images/construction/hrce-works.jpg';
import specialImg from '../assets/images/construction/special-projects.jpg';

export const INITIAL_CONSTRUCTION_EXPERIENCE: ConstructionCategory[] = [
  {
    id: 'pwd-buildings',
    title: { en: 'PWD Buildings', ta: 'பொதுப்பணித் துறை கட்டிடங்கள்' },
    image: pwdImg,
    projects: [
      {
        en: 'Constructed a G+1 government school building in Vikravandi, Villupuram within a short span of 5 months (2018).',
        ta: 'விழுப்புரம் விக்கிரவாண்டியில் அரசு பள்ளி கட்டிடத்தை (G+1) வெறும் 5 மாதங்களில் நிர்மாணித்தோம் (2018).'
      },
      {
        en: 'Constructed a government college along with cement concrete pavement in Tindivanam (2022).',
        ta: 'திண்டிவனத்தில் அரசு கல்லூரி மற்றும் சிமெண்ட் காங்கிரீட் பாதையை நிர்மாணித்தோம் (2022).'
      },
      {
        en: 'Constructed a two-story government school with an associated laboratory in Siruvathadu, Villupuram (2013–2014).',
        ta: 'விழுப்புரம் சிறுவத்தாடு-வில் இரண்டு மாடிகள் கொண்ட அரசு பள்ளி மற்றும் ஆய்வகத்தை நிர்மாணித்தோம் (2013–2014).'
      },
      {
        en: 'Constructed a sustainable government school building in Mambalapattu (2020–2021).',
        ta: 'மம்பலப்பட்டுவில் நிலைத்தன்மையான அரசு பள்ளி கட்டிடத்தை நிர்மாணித்தோம் (2020–2021).'
      },
      {
        en: 'Renovated the hostel building of Government Law College, Villupuram (2021).',
        ta: 'விழுப்புரம் அரசு சட்டக் கல்லூரி விடுதி கட்டிடத்தை புதுப்பித்தோம் (2021).'
      }
    ]
  },
  {
    id: 'wrd-works',
    title: { en: 'WRD Works', ta: 'நீர்வளத் துறை பணிகள்' },
    image: wrdImg,
    projects: [
      {
        en: 'Executed dredging of the main channel connecting the lake to the Sathanur Reservoir in the Thenpennai River bed (2017).',
        ta: 'தென்பெண்ணை நதிப்படுகையில் ஏரியை சாத்தனூர் நீர்த்தேக்கத்துடன் இணைக்கும் முதன்மை கால்வாயை வண்டல் அகற்றும் பணி செய்தோம் (2017).'
      },
      {
        en: 'Carried out dredging and construction of a retaining wall along a lake in Thiruvennainallur, Villupuram (2022).',
        ta: 'விழுப்புரம் திருவெண்ணைநல்லூரில் ஏரிக்கரையில் வண்டல் அகற்றுதல் மற்றும் தடுப்புச் சுவர் கட்டுமானப் பணி செய்தோம் (2022).'
      },
      {
        en: 'Constructed an under-sluice in Irruvelpattu, Villupuram (2021).',
        ta: 'விழுப்புரம் இறுவேல்பட்டுவில் அடிக்கீழ் வாய்க்கால் (அண்டர்-ஸ்லூஸ்) அமைத்தோம் (2021).'
      }
    ]
  },
  {
    id: 'rural-department',
    title: { en: 'Rural Department', ta: 'ஊரக வளர்ச்சித் துறை' },
    image: ruralImg,
    projects: [
      {
        en: 'Constructed roadways connecting villages with cement concrete (CC) and bituminous pavements, including Pillur–Pillaiyarkuppam, Pillur–Agaram, and Thirupachanur–Serndanur (2023).',
        ta: 'பிள்ளூர்–பிள்ளையார்குப்பம், பிள்ளூர்–அகரம், திருபாச்சனூர்–செரண்டனூர் உள்ளிட்ட கிராமங்களை இணைக்கும் சிமெண்ட் காங்கிரீட் மற்றும் தார் சாலைகளை நிர்மாணித்தோம் (2023).'
      },
      {
        en: 'Constructed a culvert on Pillayarkuppam Village Road.',
        ta: 'பிள்ளையார்குப்பம் கிராம சாலையில் ஒரு பாலம் (culvert) கட்டினோம்.'
      }
    ]
  },
  {
    id: 'hrce-works',
    title: { en: 'HR&CE Works', ta: 'இந்து சமய அறநிலையத் துறை பணிகள்' },
    image: hrceImg,
    projects: [
      {
        en: 'Constructed a wedding pavilion, formerly known as Kambar Mandapam, in Thiruvennainallur (2019–2021).',
        ta: 'திருவெண்ணைநல்லூரில் முன்பு கம்பர் மண்டபம் என அழைக்கப்பட்ட திருமண மண்டபத்தை நிர்மாணித்தோம் (2019–2021).'
      }
    ]
  },
  {
    id: 'special-projects',
    title: { en: 'Special Projects', ta: 'சிறப்புத் திட்டங்கள்' },
    image: specialImg,
    projects: [
      {
        en: 'During the COVID-19 pandemic, we converted classrooms into hospital ward rooms for patients, and ensured their cleaning and maintenance.',
        ta: 'கோவிட்-19 பெருந்தொற்று காலத்தில், வகுப்பறைகளை நோயாளிகளுக்கான மருத்துவமனை வார்டு அறைகளாக மாற்றி, சுத்தம் மற்றும் பராமரிப்பை உறுதி செய்தோம்.'
      },
      {
        en: 'Constructed polling booths and strong rooms within existing structures for rural, state, and central elections, without causing any structural damage.',
        ta: 'ஊரக, மாநில மற்றும் மத்திய தேர்தல்களுக்கான வாக்குச் சாவடிகள் மற்றும் ஸ்ட்ராங் ரூம்களை, இருக்கும் கட்டமைப்புகளுக்குள் எந்த சேதமும் ஏற்படுத்தாமல் அமைத்தோம்.'
      }
    ]
  }
];
