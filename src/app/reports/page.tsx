'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';
import type { IncidentReport } from '@/lib/types';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ReportsPage() {
  const firestore = useFirestore();

  const reportsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'incident_reports'), orderBy('reportDate', 'desc'));
  }, [firestore]);

  const { data: reports, isLoading, error } = useCollection<IncidentReport>(reportsQuery);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Data não disponível';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Denúncias Recebidas</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Lista de todas as denúncias de maus-tratos a animais registradas.
            </p>
          </div>

          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="border-t pt-4">
                      <Skeleton className="h-5 w-1/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && (
             <Alert variant="destructive" className="max-w-2xl mx-auto">
               <AlertTriangle className="h-4 w-4" />
               <AlertTitle>Erro ao carregar as denúncias</AlertTitle>
               <AlertDescription>
                 Não foi possível buscar os dados do servidor. Por favor, tente novamente mais tarde.
               </AlertDescription>
             </Alert>
          )}

          {!isLoading && !error && reports && reports.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">Nenhuma denúncia registrada ainda.</p>
            </div>
          )}

          {!isLoading && reports && reports.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <Card key={report.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">Denúncia em {report.location || 'Local não informado'}</CardTitle>
                    <CardDescription>{formatDate(report.reportDate)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1">
                    <div>
                      <h4 className="font-semibold mb-1">Descrição do Incidente</h4>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    {report.aiAnalysis && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-1">Análise da IA</h4>
                        <p className="text-sm text-muted-foreground">
                          <strong>Estimativa:</strong> {report.aiAnalysis.abuseEstimate}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                          <strong>Recursos:</strong> {report.aiAnalysis.resources}
                        </p>
                      </div>
                    )}
                     <div className="border-t pt-4 text-xs text-muted-foreground">
                        <p><strong>Denunciante:</strong> {report.reporterName || 'Anônimo'}</p>
                        <p><strong>Contato:</strong> {report.reporterContact || 'Não informado'}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
