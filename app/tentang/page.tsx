import { redirect } from 'next/navigation'
export default function TentangRedirect() {
  redirect('/about?lang=id')
}