import { notFound } from 'next/navigation'
import { Mail, MapPin } from 'lucide-react'

import { isLocale, type Locale } from '@/lib/i18n'
import { getTranslations } from 'next-intl/server'

interface AboutPageProps {
 params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
 const { locale: localeParam } = await params

 if (!isLocale(localeParam)) {
  notFound()
 }

 const locale = localeParam as Locale
 const t = await getTranslations({ locale, namespace: 'about' })

 const skills = [
  t('skills.js'),
  t('skills.react'),
  t('skills.nodejs'),
  t('skills.database'),
  t('skills.devops'),
  t('skills.cloud')
 ]

 const experiences = [
  {
   year: '2019-2021',
   role: t('experience.frontend.role'),
   company: t('experience.frontend.company'),
   description: t('experience.frontend.description')
  },
  {
   year: '2021-2023',
   role: t('experience.fullstack.role'),
   company: t('experience.fullstack.company'),
   description: t('experience.fullstack.description')
  },
  {
   year: '2023-至今',
   role: t('experience.senior.role'),
   company: t('experience.senior.company'),
   description: t('experience.senior.description')
  }
 ]

 return (
  <div className="container space-y-16 py-16">
   <section className="mx-auto max-w-4xl text-center">
    <h1 className="text-4xl font-bold leading-tight md:text-5xl">{t('title')}</h1>
    <p className="mt-6 text-lg text-muted-foreground">
     {t('subtitle')}
    </p>
   </section>

   <section className="mx-auto max-w-4xl grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
    <div className="space-y-8">
     <div>
      <h2 className="text-2xl font-semibold mb-4">{t('intro.title')}</h2>
      <p className="text-muted-foreground leading-relaxed">
        {t('intro.paragraph1')}
      </p>
      <p className="text-muted-foreground leading-relaxed mt-4">
        {t('intro.paragraph2')}
      </p>
     </div>

     <div>
      <h2 className="text-2xl font-semibold mb-4">{t('skills.title')}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
       {skills.map((skill) => (
        <div key={skill} className="border bg-background/70 px-4 py-2 text-sm">
         {skill}
        </div>
       ))}
      </div>
     </div>
    </div>

    <div className="space-y-8">
     <div>
      <h2 className="text-2xl font-semibold mb-4">{t('experience.title')}</h2>
      <div className="space-y-6">
       {experiences.map((exp) => (
        <div key={exp.year} className="border-l-2 border-primary pl-4">
         <div className="text-sm text-primary font-medium">{exp.year}</div>
         <div className="font-semibold mt-1">{exp.role}</div>
         <div className="text-sm text-muted-foreground">{exp.company}</div>
         <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
        </div>
       ))}
      </div>
     </div>

     <div>
      <h2 className="text-2xl font-semibold mb-4">{t('contact.title')}</h2>
      <div className="space-y-4">
       <a
        href="mailto:catgrandfa9898@outlook.com"
        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
       >
        <Mail className="h-4 w-4" />
        catgrandfa9898@outlook.com
       </a>
       <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        {t('contact.location')}
       </div>
      </div>

      {/* <div className="flex gap-3 mt-6">
       <Button variant="outline" size="sm" asChild>
        <Link href="mailto:catgrandfa9898@outlook.com">
         <Mail className="h-4 w-4 mr-2" />
         {t('contact.sendEmail')}
        </Link>
       </Button>
      </div> */}
     </div>
    </div>
   </section>

   {/* <section className="mx-auto max-w-4xl text-center border bg-gradient-to-br from-muted/40 via-card to-card/60 p-12">
    <h2 className="text-2xl font-semibold mb-4">{t('cta.title')}</h2>
    <p className="text-muted-foreground mb-6">
      {t('cta.description')}
    </p>
    <Button asChild size="lg">
     <Link href="mailto:catgrandfa9898@outlook.com">
      <Mail className="h-4 w-4 mr-2" />
      {t('cta.button')}
     </Link>
    </Button>
   </section> */}
  </div>
 )
}
