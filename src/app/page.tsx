import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookHeart, Info, GraduationCap, MapPin, Phone, Globe } from "lucide-react";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ReportingSection from "@/components/reporting-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { educationalContent } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
  
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative container px-4 md:px-6 z-10">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold font-headline">Sua voz pode salvar uma vida.</h1>
              <p className="text-lg md:text-xl text-white/90">
                Denuncie maus-tratos a animais em Raul Soares. Juntos, podemos fazer a diferença.
              </p>
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="#report">
                  Fazer uma Denúncia <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>
        
        <ReportingSection />

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm text-accent-foreground font-medium">Sobre Nós</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Nossa Missão</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  "Fale Pelos Animais" é uma plataforma dedicada a dar voz àqueles que não podem se defender. Nosso objetivo é criar uma comunidade vigilante em Raul Soares - MG, onde qualquer cidadão pode, de forma segura e anônima, denunciar casos de maus-tratos a animais.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl w-full mt-12 text-center text-muted-foreground">
              <p>Acreditamos que a conscientização e a ação coletiva são as ferramentas mais poderosas para combater a crueldade. Ao registrar uma denúncia, você não está apenas salvando uma vida, mas também contribuindo para um ambiente mais seguro e compassivo para todos os seres. Este projeto é uma iniciativa acadêmica que visa aplicar a tecnologia para o bem social, servindo como um canal de alerta e mobilização comunitária.</p>
            </div>
          </div>
        </section>

        <section id="education" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm text-accent-foreground font-medium">Educação</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Informar para Proteger</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Conhecimento é a primeira linha de defesa contra a crueldade animal.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl w-full mt-12">
              <Accordion type="single" collapsible className="w-full">
                {educationalContent.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        {item.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground pl-8">
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
