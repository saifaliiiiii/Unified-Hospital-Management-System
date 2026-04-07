import doctorsCsv from './punjab_doctors_list.csv?raw'
import doctorContactLeads from './doctorContactLeads'
import { parseDoctorsCsv, sortUnique } from '../utils/parseDoctorsCsv'
import { mergeDoctorRecords } from '../utils/mergeMedicalDirectory'

export const doctorsData = mergeDoctorRecords(
  parseDoctorsCsv(doctorsCsv),
  doctorContactLeads,
)

export const doctorSpecializations = sortUnique(
  doctorsData.map((doctor) => doctor.specialization),
)

export const doctorLocations = sortUnique(
  doctorsData.map((doctor) => doctor.city || doctor.district || doctor.state),
)

export default doctorsData
