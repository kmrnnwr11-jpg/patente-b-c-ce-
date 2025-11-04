import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

const DEFAULT_SEO = {
  title: 'Patente B 2025 - Quiz, Teoria e Simulazioni Esame',
  description: 'Preparati all\'esame della Patente B con quiz ministeriali, teoria interattiva, spiegazioni AI e simulazioni d\'esame. Supera al primo colpo!',
  keywords: 'patente b, quiz patente, esame patente, teoria patente, simulazione esame, patente 2025, quiz ministeriali',
  image: '/og-image.png',
  type: 'website'
};

export const SEO: FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  type
}) => {
  const location = useLocation();
  
  const seoTitle = title ? `${title} | Patente B 2025` : DEFAULT_SEO.title;
  const seoDescription = description || DEFAULT_SEO.description;
  const seoKeywords = keywords || DEFAULT_SEO.keywords;
  const seoImage = image || DEFAULT_SEO.image;
  const seoType = type || DEFAULT_SEO.type;
  const seoUrl = `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = seoTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', seoDescription);
    updateMetaTag('keywords', seoKeywords);

    // Open Graph tags
    updateMetaTag('og:title', seoTitle, true);
    updateMetaTag('og:description', seoDescription, true);
    updateMetaTag('og:image', seoImage, true);
    updateMetaTag('og:url', seoUrl, true);
    updateMetaTag('og:type', seoType, true);
    updateMetaTag('og:site_name', 'Patente B 2025', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', seoTitle);
    updateMetaTag('twitter:description', seoDescription);
    updateMetaTag('twitter:image', seoImage);

    // Additional SEO tags
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', 'Italian');
    updateMetaTag('author', 'Patente B 2025');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = seoUrl;

  }, [seoTitle, seoDescription, seoKeywords, seoImage, seoType, seoUrl]);

  return null;
};

// Hook per usare SEO in modo più semplice
export const useSEO = (props: SEOProps) => {
  return <SEO {...props} />;
};

// Preset SEO per pagine comuni
export const SEO_PRESETS = {
  home: {
    title: 'Home',
    description: 'Inizia subito a prepararti per l\'esame della Patente B con quiz, teoria e simulazioni',
    keywords: 'patente b, quiz patente, esame patente'
  },
  quiz: {
    title: 'Simulazione Esame',
    description: 'Simula l\'esame della Patente B con 30 domande ministeriali e timer di 20 minuti',
    keywords: 'simulazione esame patente, quiz patente b, esame patente online'
  },
  theory: {
    title: 'Teoria Patente B',
    description: 'Studia la teoria completa per l\'esame della Patente B con capitoli interattivi',
    keywords: 'teoria patente b, manuale patente, studio patente'
  },
  achievements: {
    title: 'Achievement',
    description: 'Sblocca achievement studiando e completando quiz per la Patente B',
    keywords: 'achievement patente, gamification, progressi studio'
  },
  leaderboard: {
    title: 'Classifica',
    description: 'Confrontati con altri studenti nella classifica globale della Patente B',
    keywords: 'classifica patente, leaderboard, competizione studio'
  }
};

