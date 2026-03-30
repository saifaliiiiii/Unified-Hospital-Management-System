import { FindHospitalsPageClient } from './FindHospitalsPageClient'

type FindHospitalsPageProps = {
  searchParams?: {
    search?: string
  }
}

export default function FindHospitalsPage({
  searchParams,
}: FindHospitalsPageProps) {
  return <FindHospitalsPageClient initialSearch={searchParams?.search ?? ''} />
}
