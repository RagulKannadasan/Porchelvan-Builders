import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Project from '@/models/Project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/dashboard');
  }

  await connectToDatabase();
  const customers = await User.find({ role: 'CUSTOMER' }).lean();
  const projects = await Project.find().populate('customerId', 'name email').lean();

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-porchelvan-navy)] text-white p-6">
        <h2 className="mb-8 text-xl font-bold tracking-tight">Admin Portal</h2>
        <nav className="space-y-4">
          <a href="#overview" className="block text-sm hover:text-[var(--color-porchelvan-orange)]">Overview</a>
          <a href="#customers" className="block text-sm hover:text-[var(--color-porchelvan-orange)]">Customers</a>
          <a href="#projects" className="block text-sm hover:text-[var(--color-porchelvan-orange)]">Projects</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="mb-8 text-3xl font-bold text-[var(--color-porchelvan-navy)]">Operations Dashboard</h1>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {projects.filter((p: any) => p.status !== 'Completion').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <section id="projects" className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Manage Projects</h2>
            <button className="rounded bg-[var(--color-porchelvan-orange)] px-4 py-2 text-sm font-bold text-white hover:opacity-90">
              CREATE PROJECT
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border bg-white shadow">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 && (
                  <tr><td colSpan={4} className="p-4 text-center">No projects found.</td></tr>
                )}
                {projects.map((proj: any) => (
                  <tr key={proj._id.toString()} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{proj.title}</td>
                    <td className="px-6 py-4">{proj.customerId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-800">
                        {proj.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                       <button className="text-[var(--color-porchelvan-orange)] font-medium hover:underline">Edit</button>
                       <button className="text-red-500 font-medium hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
