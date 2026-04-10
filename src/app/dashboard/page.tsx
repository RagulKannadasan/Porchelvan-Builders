import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/db';
import Project from '@/models/Project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const STATUS_MAP: Record<string, number> = {
  Concept: 25,
  Design: 50,
  Construction: 75,
  Completion: 100,
};

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // NextAuth token.id is mapped to session.user.id
  const userId = (session.user as any).id;

  await connectToDatabase();
  const projects = await Project.find({ customerId: userId }).lean();

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[var(--color-porchelvan-navy)]">
            Welcome back, {session.user.name}
          </h1>
        </header>

        <h2 className="mb-6 text-xl font-bold text-gray-800">Your Active Projects</h2>
        
        {projects.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              You do not have any active projects linked to your account yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {projects.map((project: any) => (
              <Card key={project._id.toString()}>
                <CardHeader>
                  <CardTitle className="text-lg text-[var(--color-porchelvan-navy)]">{project.title}</CardTitle>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-sm font-medium">
                      <span>Status: <span className="text-[var(--color-porchelvan-orange)]">{project.status}</span></span>
                      <span>{STATUS_MAP[project.status]}%</span>
                    </div>
                    <Progress value={STATUS_MAP[project.status]} className="bg-gray-200" />
                    
                    <div className="mt-6 flex justify-between text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      <span className={STATUS_MAP[project.status] >= 25 ? 'text-green-600' : ''}>Concept</span>
                      <span className={STATUS_MAP[project.status] >= 50 ? 'text-green-600' : ''}>Design</span>
                      <span className={STATUS_MAP[project.status] >= 75 ? 'text-green-600' : ''}>Construction</span>
                      <span className={STATUS_MAP[project.status] === 100 ? 'text-green-600' : ''}>Completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
