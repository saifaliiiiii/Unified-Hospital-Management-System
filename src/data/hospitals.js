import rawHospitals from './hospitals.raw.json'

const cities = [
  'Ludhiana',
  'Amritsar',
  'Jalandhar',
  'Patiala',
  'Bathinda',
  'Mohali',
  'Hoshiarpur',
  'Pathankot',
  'Kapurthala',
  'Moga',
  'Sangrur',
  'Rupnagar',
  'Firozpur',
  'Fatehgarh Sahib',
  'Muktsar',
  'Barnala',
]

const specialities = [
  'Multi-Speciality',
  'Cardiac Care',
  'Orthopedics',
  'Women & Children',
  'Emergency Care',
  'Cancer Care',
  'Neuro Care',
  'Eye Care',
]

const imagePool = [
  '/images/hospitals/hospital-1.svg',
  '/images/hospitals/hospital-2.svg',
  '/images/hospitals/hospital-3.svg',
  '/images/hospitals/hospital-4.svg',
]

const carePrograms = [
  'Cardiac Sciences',
  'Emergency Medicine',
  'Women and Child Care',
  'Advanced Orthopedics',
  'Critical Care',
  'Neurosciences',
  'Oncology',
  'Renal Support',
  'Pulmonology',
  'Preventive Diagnostics',
]

function hashString(value) {
  return [...value].reduce(
    (accumulator, character) =>
      (accumulator * 31 + character.charCodeAt(0)) % 1000003,
    7,
  )
}

function titleCase(value) {
  return value
    .toLowerCase()
    .replace(/\b([a-z])/g, (match) => match.toUpperCase())
}

const hospitals = rawHospitals.map((hospital, index) => {
  const baseHash = hashString(hospital.name)
  const locationCity = cities[baseHash % cities.length]
  const speciality = specialities[baseHash % specialities.length]
  const rating = Number((3.8 + (baseHash % 13) * 0.1).toFixed(1))
  const name = titleCase(hospital.name)
  const location = `${locationCity}, Punjab`
  const type = baseHash % 2 === 0 ? 'Government' : 'Private'
  const timings = baseHash % 3 === 0 ? 'Open 24 Hours' : '8:00 AM - 8:00 PM'
  const emergency = baseHash % 4 === 0
  const specialties = [
    speciality,
    specialities[(baseHash + 1) % specialities.length],
    specialities[(baseHash + 2) % specialities.length],
  ].filter((value, position, array) => array.indexOf(value) === position)
  const image = imagePool[index % imagePool.length]
  const address = `${(baseHash % 180) + 10}, ${locationCity} Medical District, Punjab`
  const waitTime = `${15 + (baseHash % 35)} min avg wait`
  const programs = [
    carePrograms[baseHash % carePrograms.length],
    carePrograms[(baseHash + 3) % carePrograms.length],
  ]

  return {
    id: `${baseHash}-${index}`,
    name,
    image,
    location,
    district: locationCity,
    rating,
    speciality,
    type,
    timings,
    emergency,
    address,
    waitTime,
    summary: `${name} is a ${speciality.toLowerCase()} destination in ${locationCity} with modern care pathways and quick access to specialists.`,
    programs,
    specialties,
    directionsLabel: `${name}, ${location}`,
  }
})

export default hospitals
export const hospitalNames = hospitals.map((hospital) => hospital.name)
export const hospitalLocations = [
  ...new Set(hospitals.map((hospital) => hospital.location)),
].sort()
export const hospitalSpecialities = [
  ...new Set(hospitals.map((hospital) => hospital.speciality)),
].sort()
export const hospitalRatingOptions = [
  { value: '', label: 'Any rating' },
  { value: '4', label: '4.0+' },
  { value: '4.5', label: '4.5+' },
  { value: '4.8', label: '4.8+' },
]
export const hospitalSortOptions = [
  { value: 'rating', label: 'By Rating' },
  { value: 'alphabetical', label: 'Alphabetical' },
]
