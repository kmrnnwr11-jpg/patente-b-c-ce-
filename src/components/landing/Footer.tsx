import { FC } from 'react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone,
  MapPin,
  Car
} from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Prodotto',
    links: [
      { label: 'Quiz Ministeriali', href: '/quiz' },
      { label: 'Simulazioni Esame', href: '/simulazione' },
      { label: 'Teoria Completa', href: '/teoria' },
      { label: 'Statistiche', href: '/statistiche' },
      { label: 'Premium', href: '/premium' }
    ]
  },
  {
    title: 'Risorse',
    links: [
      { label: 'Come Funziona', href: '/come-funziona' },
      { label: 'Guide e Tutorial', href: '/guide' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Blog', href: '/blog' },
      { label: 'Aggiornamenti', href: '/aggiornamenti' }
    ]
  },
  {
    title: 'Azienda',
    links: [
      { label: 'Chi Siamo', href: '/chi-siamo' },
      { label: 'Contatti', href: '/contatti' },
      { label: 'Lavora con Noi', href: '/lavora-con-noi' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Partner', href: '/partner' }
    ]
  },
  {
    title: 'Legale',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Termini di Servizio', href: '/termini' },
      { label: 'Cookie Policy', href: '/cookie' },
      { label: 'Rimborsi', href: '/rimborsi' },
      { label: 'Licenze', href: '/licenze' }
    ]
  }
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' }
];

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-20 pb-10 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Car className="w-7 h-7 text-gray-900" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Patente B</h3>
                <p className="text-white/60 text-sm">2025</p>
              </div>
            </div>
            <p className="text-white/70 mb-6 leading-relaxed">
              La piattaforma più completa per la preparazione all'esame della Patente B. 
              Oltre 7000 quiz ministeriali, teoria completa e spiegazioni AI.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:info@patenteb2025.it" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span>info@patenteb2025.it</span>
              </a>
              <a href="tel:+390123456789" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                <span>+39 012 345 6789</span>
              </a>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="w-5 h-5" />
                <span>Milano, Italia</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <p className="text-white/60 text-sm text-center md:text-left">
              © {currentYear} Patente B 2025. Tutti i diritti riservati.
              <span className="mx-2">•</span>
              Quiz ministeriali ufficiali aggiornati al 2025
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      w-10 h-10 rounded-full 
                      bg-white/10 hover:bg-white/20
                      flex items-center justify-center
                      text-white/70 hover:text-white
                      transition-all duration-300
                      hover:scale-110
                    "
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/50 text-xs text-center leading-relaxed">
              <strong>Disclaimer:</strong> Questa piattaforma è uno strumento di studio indipendente. 
              I quiz sono basati sui database ministeriali ufficiali. 
              Non siamo affiliati con il Ministero dei Trasporti italiano.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

