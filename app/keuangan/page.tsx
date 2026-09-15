import { redirect } from 'next/navigation'
export default function KeuanganRedirect() {
  redirect('/finance?lang=id')
}