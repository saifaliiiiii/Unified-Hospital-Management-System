function splitCsvLine(line) {
  const values = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    const nextCharacter = line[index + 1]

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (character === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += character
  }

  values.push(current.trim())
  return values
}

function normalizeValue(value) {
  if (!value) return ''
  return value.replace(/\s+/g, ' ').trim()
}

function createDoctorId(doctor, index) {
  return `${doctor.name}-${doctor.hospital}-${doctor.city}-${index}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function titleCaseValue(value) {
  const normalized = normalizeValue(value)
  if (!normalized) return ''

  return normalized
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function parseDoctorsCsv(csvText) {
  const normalizedText = csvText.replace(/^\uFEFF/, '').trim()
  if (!normalizedText) {
    return []
  }

  const [headerLine, ...rows] = normalizedText.split(/\r?\n/)
  const headers = splitCsvLine(headerLine)

  return rows
    .map((row, index) => {
      const columns = splitCsvLine(row)
      const rawDoctor = headers.reduce((doctor, header, headerIndex) => {
        doctor[header] = normalizeValue(columns[headerIndex] ?? '')
        return doctor
      }, {})

      if (!rawDoctor['Doctor Name']) {
        return null
      }

      const city = titleCaseValue(rawDoctor.City)
      const district = titleCaseValue(rawDoctor.District)
      const state = 'Punjab'
      const locationParts = [city, district !== city ? district : '', state].filter(
        Boolean,
      )

      const doctor = {
        id: createDoctorId(
          {
            name: rawDoctor['Doctor Name'],
            hospital: rawDoctor['Hospital Name'],
            city,
          },
          index,
        ),
        name: rawDoctor['Doctor Name'],
        specialization: rawDoctor.Department || 'General Medicine',
        hospital: rawDoctor['Hospital Name'] || 'Hospital not listed',
        hospitalType: rawDoctor['Hospital Type'] || '',
        location: locationParts.join(', '),
        city,
        district,
        state,
        experience: rawDoctor.Experience || '',
        contact: rawDoctor.Contact || '',
        qualification: rawDoctor.Qualification || '',
        role: rawDoctor['Role/Designation'] || '',
        gender: rawDoctor.Gender || '',
      }

      return doctor
    })
    .filter(Boolean)
}

export function sortUnique(values) {
  return [...new Set(values.filter(Boolean))].sort((left, right) =>
    left.localeCompare(right),
  )
}
