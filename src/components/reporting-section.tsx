'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Upload, AlertTriangle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { handleImageAnalysisAndSaveReport } from '@/app/actions';
import type { AnalyzeAnimalAbuseImageOutput } from '@/ai/flows/analyze-animal-abuse-image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const reportSchema = z.object({
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' }),
  location: z.string().optional(),
  reporterName: z.string().optional(),
  reporterContact: z.string().optional(),
});

export default function ReportingSection() {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeAnimalAbuseImageOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      description: '',
      location: '',
      reporterName: '',
      reporterContact: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: 'destructive',
          title: 'Arquivo muito grande',
          description: 'Por favor, selecione uma imagem com menos de 5MB.',
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof reportSchema>) => {
    if (!imageFile) {
      toast({
        variant: 'destructive',
        title: 'Foto obrigatória',
        description: 'Por favor, anexe uma foto da situação.',
      });
      return;
    }

    setIsSubmitting(true);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = async () => {
      const photoDataUri = reader.result as string;
      const result = await handleImageAnalysisAndSaveReport({
        ...values,
        photoDataUri,
      });

      if (result.success && result.data) {
        setAnalysisResult(result.data);
        toast({
          title: 'Análise Concluída',
          description: 'A sua denúncia foi processada e salva com sucesso.',
        });
        form.reset();
        setImageFile(null);
        setImagePreview(null);

      } else {
        toast({
          variant: 'destructive',
          title: 'Erro na Análise',
          description: result.error || 'Ocorreu um erro desconhecido.',
        });
      }
      setIsSubmitting(false);
    };
    reader.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao ler arquivo',
        description: 'Não foi possível processar a imagem. Tente novamente.',
      });
      setIsSubmitting(false);
    };
  };

  return (
    <section id="report" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Denuncie Maus-Tratos</h2>
            <p className="text-muted-foreground md:text-xl">
              Use o formulário abaixo para enviar sua denúncia. Nossa ferramenta de IA analisará a imagem e fornecerá recursos.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Formulário de Denúncia e Análise</CardTitle>
              <CardDescription>Preencha os detalhes com o máximo de informação possível.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição da Situação</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o que você viu, o estado do animal, o ambiente, etc."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localização (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Endereço ou ponto de referência" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="reporterName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seu Nome (Opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="reporterContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seu Contato (Opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Email ou telefone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormItem>
                    <FormLabel>Foto da Situação</FormLabel>
                    <FormControl>
                      <div
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="space-y-1 text-center">
                          {imagePreview ? (
                            <Image src={imagePreview} alt="Pré-visualização da imagem" width={150} height={150} className="mx-auto rounded-md object-cover" />
                          ) : (
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                          )}
                          <div className="flex text-sm text-muted-foreground justify-center">
                            <span className="font-medium text-primary">
                              {imageFile ? 'Trocar imagem' : 'Carregar uma imagem'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF até 5MB</p>
                          <input ref={fileInputRef} type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Importante!</AlertTitle>
                    <AlertDescription>
                      Esta plataforma é um projeto educacional e não substitui os canais oficiais de denúncia. Em casos de emergência, ligue para a Polícia Militar (190).
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Analisando e Salvando...' : 'Analisar e Enviar Denúncia'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {isSubmitting && (
            <div className="flex justify-center items-center flex-col gap-4 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Analisando e salvando a denúncia... Isso pode levar um momento.</p>
            </div>
          )}

          {analysisResult && (
            <Card className="mt-8 animate-in fade-in-50 duration-500">
              <CardHeader className="bg-accent/20">
                <CardTitle>Resultado da Análise de IA</CardTitle>
                <CardDescription>Com base na imagem e descrição fornecidas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h3 className="font-semibold text-lg">Estimativa de Abuso/Negligência</h3>
                  <p className="text-muted-foreground mt-1">{analysisResult.abuseEstimate}</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg">Recursos e Próximos Passos</h3>
                  <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{analysisResult.resources}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
