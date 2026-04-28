import { useEffect, useRef, useState } from 'react';

import AiShowcase from '../components/AiShowcase';
import AppForm from '../components/AppForm';
import Categories from '../components/Categories';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Impact from '../components/Impact';
import Navbar from '../components/Navbar';
import Testimonials from '../components/Testimonials';
import { useApi } from '../hooks/useApi';
import { useForm } from '../hooks/useForm';

export default function Home() {
  const appSectionRef = useRef(null);
  const form = useForm();
  const { result, loading, error, submitLegalQuery, clearResult } = useApi();
  const [scrollProgress, setScrollProgress] = useState(0);

  function scrollToSelector(selector) {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  }

  function scrollToApp() {
    appSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleCategoryShortcut(categoryId) {
    form.setCategory(categoryId);
    scrollToApp();
  }

  async function handleSubmit(payload) {
    await submitLegalQuery(payload);
  }

  function handleReset() {
    clearResult();
    form.resetForm();
    scrollToApp();
  }

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll('.reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    function handleScroll() {
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0;
      setScrollProgress(progress);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="app-shell">
      <Navbar onPrimaryClick={scrollToApp} scrollProgress={scrollProgress} />
      <Hero
        onPrimaryClick={scrollToApp}
        onSecondaryClick={() => scrollToSelector('#how')}
      />
      <HowItWorks />
      <Features />
      <AiShowcase onPrimaryClick={scrollToApp} />
      <Categories onSelectCategory={handleCategoryShortcut} />
      <section id="app" ref={appSectionRef}>
        <AppForm
          error={error}
          form={form}
          loading={loading}
          onReset={handleReset}
          onSubmit={handleSubmit}
          result={result}
        />
      </section>
      <Impact />
      <Testimonials />
      <Footer />
    </div>
  );
}
