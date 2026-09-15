import { redirect } from 'next/navigation'
export default function DasborRedirect() {
  redirect('/dashboard?lang=id')
}