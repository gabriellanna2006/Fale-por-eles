import Image from "next/image";
import { ArrowRight, BookHeart, Globe, GraduationCap, MapPin, Phone } from "lucide-react";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ReportingSection from "@/components/reporting-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { resources, educationalContent } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
  const mapImage = PlaceHolderImages.find((img) => img.id === 'map-1');
  const vetImage = PlaceHolderImages.find((img) => img.id === 'resource-1');
  const shelterImage = PlaceHolderImages.find((img) => img.id === 'resource-2');

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

        <section id="map" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Mapa de Incidentes</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Veja as áreas em Raul Soares com maior número de denúncias de maus-tratos.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl mt-12">
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-0">
                  {mapImage && (
                    <Image
                      src={mapImage.imageUrl}
                      alt={mapImage.description}
                      width={1200}
                      height={800}
                      className="w-full h-auto object-cover"
                      data-ai-hint={mapImage.imageHint}
                    />
                  )}
                </CardContent>
              </Card>
              <p className="text-xs text-muted-foreground text-center mt-2">Nota: O mapa é uma representação visual e os pontos são ilustrativos.</p>
            </div>
          </div>
        </section>

        <section id="resources" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm text-accent-foreground font-medium">Recursos</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Apoio e Cuidado Animal</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Encontre ajuda profissional para animais necessitados em Raul Soares.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-2 mt-12">
              {resources.map((resource) => (
                <Card key={resource.name} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="w-full">
                      <CardTitle className="text-xl font-bold">{resource.name}</CardTitle>
                      <p className="text-muted-foreground">{resource.type}</p>
                    </div>
                    <BookHeart className="h-8 w-8 text-accent" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{resource.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{resource.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{resource.phone}</span>
                      </div>
                      {resource.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a href={resource.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Visitar site
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
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
