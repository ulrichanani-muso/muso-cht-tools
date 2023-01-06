import { PropsWithChildren } from 'react'
import ChtInstanceProvider from 'src/components/ChtInstanceProvider'
import AdminLayout from './AdminLayout'

export default function ChtAdminLayout({ children }: PropsWithChildren) {
  return (
    <AdminLayout>
      <ChtInstanceProvider>
        {children}
      </ChtInstanceProvider>
    </AdminLayout>
  )
}
