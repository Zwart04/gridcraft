import { redirect } from 'next/navigation'
export default function PengaturanRedirect() {
  redirect('/settings?lang=id')
}