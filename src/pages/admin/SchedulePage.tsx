import AdminLayout from '../../layouts/AdminLayout'
import DashboardHeader from '../../features/admin/DashboardHeader'
import AgendaTimeline from '../../features/admin/AgendaTimeline'

// Painel Principal do Barbeiro - Gestão Diária
export default function SchedulePage() {
  return (
    <AdminLayout>
      <DashboardHeader />
      <AgendaTimeline />
    </AdminLayout>
  )
}
