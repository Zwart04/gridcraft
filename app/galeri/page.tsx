import { redirect } from 'next/navigation'
export default function GaleriRedirect() {
  redirect('/gallery?lang=id')
}