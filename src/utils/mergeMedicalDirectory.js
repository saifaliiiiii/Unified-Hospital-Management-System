function normalizeValue(value) {
  if (value == null) {
    return ''
  }

  const normalized = String(value).replace(/\s+/g, ' ').trim()
  if (!normalized || normalized.toLowerCase() === 'not available') {
    return ''
  }

  return normalized
}

function normalizePhone(value) {
  const normalized = normalizeValue(value)
  const digits = normalized.replace(/[^\d]/g, '')

  if (digits.length < 7) {
    return ''
  }

  return normalized
}

function normalizeBooking(value) {
  const normalized = normalizeValue(value)
  return normalized || null
}

function compact(value) {
  return normalizeValue(value).toLowerCase().replace(/[^a-z0-9]/g, '')
}

const hospitalAliases = new Map([
  ['fortismohali', 'fortismohali'],
  ['fortishospitalmohali', 'fortismohali'],
  ['columbiaasiapatiala', 'columbiaasiapatiala'],
  ['columbiaasiahospitalpatiala', 'columbiaasiapatiala'],
  ['dmchludhiana', 'dayanandmedicalcollegeludhiana'],
  ['dayanandmedicalcollegeludhiana', 'dayanandmedicalcollegeludhiana'],
  ['maxhospitalmohali', 'maxhospitalmohali'],
  ['maxsuperspecialtyhospitalbathinda', 'maxsuperspecialtyhospitalbathinda'],
  ['gurunanakdevhospitalamritsar', 'gurunanakdevhospitalamritsar'],
  ['fortisescortshospitalamritsar', 'fortisescortshospitalamritsar'],
])

export function getHospitalMatchKey(name) {
  const compactName = compact(name)
  return hospitalAliases.get(compactName) || compactName
}

export function getDoctorMatchKey(name, hospital) {
  return `${compact(name)}::${getHospitalMatchKey(hospital)}`
}

function shouldHospitalMatch(leftName, rightName) {
  const left = getHospitalMatchKey(leftName)
  const right = getHospitalMatchKey(rightName)

  if (!left || !right) {
    return false
  }

  if (left === right) {
    return true
  }

  const shortestLength = Math.min(left.length, right.length)
  if (shortestLength >= 12 && (left.includes(right) || right.includes(left))) {
    return true
  }

  return false
}

export function buildHospitalLeads(doctors) {
  const hospitalMap = new Map()

  doctors.forEach((doctor) => {
    const hospitalName = normalizeValue(doctor.hospital)
    if (!hospitalName) {
      return
    }

    const key = getHospitalMatchKey(hospitalName)
    const existing = hospitalMap.get(key)
    const phone = normalizePhone(doctor.phone)
    const booking = normalizeBooking(doctor.booking)

    if (existing) {
      if (!existing.phone && phone) {
        existing.phone = phone
      }

      if (!existing.booking && booking) {
        existing.booking = booking
      }

      return
    }

    hospitalMap.set(key, {
      name: hospitalName,
      phone,
      booking,
      location: 'Punjab',
    })
  })

  return [...hospitalMap.values()]
}

export function mergeDoctorRecords(existingDoctors, doctorLeads) {
  const mergedDoctors = existingDoctors.map((doctor) => ({
    ...doctor,
    contact: normalizePhone(doctor.contact),
    bookingLink: normalizeBooking(doctor.bookingLink),
  }))

  const indexByKey = new Map(
    mergedDoctors.map((doctor, index) => [
      getDoctorMatchKey(doctor.name, doctor.hospital),
      index,
    ]),
  )

  doctorLeads.forEach((lead, index) => {
    const normalizedLead = {
      name: normalizeValue(lead.name),
      hospital: normalizeValue(lead.hospital),
      contact: normalizePhone(lead.phone),
      bookingLink: normalizeBooking(lead.booking),
    }

    const key = getDoctorMatchKey(normalizedLead.name, normalizedLead.hospital)
    const existingIndex = indexByKey.get(key)

    if (existingIndex != null) {
      const currentDoctor = mergedDoctors[existingIndex]
      mergedDoctors[existingIndex] = {
        ...currentDoctor,
        contact: normalizedLead.contact || currentDoctor.contact,
        bookingLink: normalizedLead.bookingLink || currentDoctor.bookingLink,
      }
      return
    }

    const newDoctor = {
      id: `lead-${key || index}`,
      name: normalizedLead.name,
      specialization: 'General Medicine',
      hospital: normalizedLead.hospital,
      hospitalType: '',
      location: 'Punjab',
      city: '',
      district: '',
      state: 'Punjab',
      experience: '',
      contact: normalizedLead.contact,
      bookingLink: normalizedLead.bookingLink,
      qualification: '',
      role: 'Doctor',
      gender: '',
    }

    indexByKey.set(key, mergedDoctors.length)
    mergedDoctors.push(newDoctor)
  })

  const collapsedDoctors = []
  const collapsedIndexByKey = new Map()

  mergedDoctors.forEach((doctor) => {
    const key = getDoctorMatchKey(doctor.name, doctor.hospital)
    const existingCollapsedIndex = collapsedIndexByKey.get(key)

    if (existingCollapsedIndex == null) {
      collapsedIndexByKey.set(key, collapsedDoctors.length)
      collapsedDoctors.push(doctor)
      return
    }

    const currentDoctor = collapsedDoctors[existingCollapsedIndex]

    collapsedDoctors[existingCollapsedIndex] = {
      ...currentDoctor,
      contact: currentDoctor.contact || doctor.contact,
      bookingLink: currentDoctor.bookingLink || doctor.bookingLink,
      qualification: currentDoctor.qualification || doctor.qualification,
      experience: currentDoctor.experience || doctor.experience,
      role: currentDoctor.role || doctor.role,
      location: currentDoctor.location || doctor.location,
      city: currentDoctor.city || doctor.city,
      district: currentDoctor.district || doctor.district,
      hospitalType: currentDoctor.hospitalType || doctor.hospitalType,
    }
  })

  return collapsedDoctors
}

export function mergeHospitalRecords(existingHospitals, hospitalLeads) {
  const mergedHospitals = existingHospitals.map((hospital) => ({
    ...hospital,
    phone: normalizePhone(hospital.phone),
    bookingLink: normalizeBooking(hospital.bookingLink),
  }))

  hospitalLeads.forEach((lead) => {
    const existingIndex = mergedHospitals.findIndex((hospital) =>
      shouldHospitalMatch(hospital.name, lead.name),
    )

    if (existingIndex >= 0) {
      const currentHospital = mergedHospitals[existingIndex]
      mergedHospitals[existingIndex] = {
        ...currentHospital,
        phone: currentHospital.phone || normalizePhone(lead.phone),
        bookingLink:
          currentHospital.bookingLink || normalizeBooking(lead.booking),
      }
      return
    }

    mergedHospitals.push(lead)
  })

  return mergedHospitals
}

export function normalizeProviderText(value) {
  return normalizeValue(value)
}
