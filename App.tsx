import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

type Stat = { value: number; suffix: string; label: string };
type Service = { title: string; description: string; icon: string; image: string };
type CaseItem = { title: string; city: string; task: string; solution: string; result: string; image: string };
type Testimonial = { company: string; name: string; role: string; text: string };

const API_ENDPOINT = "/api/leads";

const IMAGES = {
  hero: "/images/prokadry-01-hero.jpg",
  team: "/images/prokadry-02-team.jpg",
  picker: "/images/prokadry-03-picker.jpg",
  production: "/images/prokadry-04-production.jpg",
  loaders: "/images/prokadry-05-loaders.jpg",
  general: "/images/prokadry-06-general.jpg",
  coordinator: "/images/prokadry-07-coordinator.jpg",
  guarantees: "/images/prokadry-08-guarantees.jpg",
  wide: "/images/prokadry-09-wide.jpg",
  logistics: "/images/prokadry-10-logistics.jpg",
} as const;

const navItems = [
  { label: "Главная", href: "hero" },
  { label: "О компании", href: "about" },
  { label: "Услуги", href: "services" },
  { label: "Как работаем", href: "process" },
  { label: "Гарантии", href: "guarantees" },
  { label: "Кейсы", href: "cases" },
  { label: "Отзывы", href: "reviews" },
  { label: "Контакты", href: "contacts" },
];

const stats: Stat[] = [
  { value: 5, suffix: "+", label: "лет опыта на рынке" },
  { value: 3000, suffix: "+", label: "сотрудников" },
  { value: 150, suffix: "+", label: "объектов по всей России" },
];

const services: Service[] = [
  {
    title: "Складской персонал",
    description: "Комплектовщики, кладовщики, грузчики, упаковщики",
    icon: "box",
    image: IMAGES.picker,
  },
  {
    title: "Производственный персонал",
    description: "Операторы, разнорабочие, сборщики, фасовщики",
    icon: "factory",
    image: IMAGES.production,
  },
  {
    title: "Грузчики",
    description: "Погрузка и разгрузка, перемещение грузов, работа на складе",
    icon: "truck",
    image: IMAGES.loaders,
  },
  {
    title: "Разнорабочие",
    description: "Выполнение вспомогательных и подсобных работ",
    icon: "tools",
    image: IMAGES.general,
  },
  {
    title: "Индивидуальные решения",
    description: "Подбор персонала под конкретные задачи вашего бизнеса",
    icon: "target",
    image: IMAGES.coordinator,
  },
];

const casesData: CaseItem[] = [
  {
    title: "Складской комплекс",
    city: "Москва",
    task: "Закрыть потребность в персонале в период высокого сезона.",
    solution: "Подбор и вывод команды складского персонала.",
    result: "Стабильное обеспечение объекта персоналом.",
    image: IMAGES.wide,
  },
  {
    title: "Производственный объект",
    city: "Калуга",
    task: "Необходимо обеспечить объект производственным персоналом.",
    solution: "Подбор сотрудников под график и специфику производства.",
    result: "Необходимый объем персонала без срывов смен.",
    image: IMAGES.production,
  },
  {
    title: "Логистический центр",
    city: "Санкт-Петербург",
    task: "Пиковая нагрузка в сезон поставок.",
    solution: "Оперативное увеличение команды складского персонала.",
    result: "Объект продолжил работу без сбоев.",
    image: IMAGES.logistics,
  },
];

const testimonials: Testimonial[] = [
  {
    company: "ООО ЛОГИСТИК",
    name: "Алексей Петров",
    role: "Операционный директор",
    text: "Команда ПРОКАДРЫ быстро закрыла смены в сезонный пик. Особенно ценим прозрачную коммуникацию и контроль выхода персонала.",
  },
  {
    company: "ООО МЕТАЛЛПРОМ",
    name: "Ирина Смирнова",
    role: "Директор по персоналу",
    text: "Получили стабильную команду на производственный участок в сжатые сроки. Процессы организованы четко и без лишней нагрузки на наш HR-отдел.",
  },
  {
    company: "ООО ТЕХНОЛОГИЯ",
    name: "Дмитрий Орлов",
    role: "Руководитель логистики",
    text: "ПРОКАДРЫ помогли быстро масштабировать персонал под рост объемов. Важный плюс - готовность оперативно заменять сотрудников.",
  },
];

const processSteps = [
  { title: "ЗАЯВКА", text: "Оставьте заявку или свяжитесь с нами" },
  { title: "РАСЧЕТ", text: "Формируем предложение под вашу задачу" },
  { title: "ПОДБОР", text: "Находим подходящих кандидатов" },
  { title: "ВЫХОД НА ОБЪЕКТ", text: "Оформляем документы и выводим персонал" },
  { title: "КОНТРОЛЬ", text: "Следим за качеством работы и решаем вопросы" },
];

const formatRuNumber = (num: number) => new Intl.NumberFormat("ru-RU").format(num);

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const formatPhone = (rawValue: string) => {
  const digits = rawValue.replace(/\D/g, "").replace(/^8/, "7").slice(0, 11);
  const normalized = digits.startsWith("7") ? digits : `7${digits}`;
  const trimmed = normalized.slice(0, 11);
  const p1 = trimmed.slice(1, 4);
  const p2 = trimmed.slice(4, 7);
  const p3 = trimmed.slice(7, 9);
  const p4 = trimmed.slice(9, 11);
  let result = "+7";
  if (p1) result += ` (${p1}`;
  if (p1.length === 3) result += ")";
  if (p2) result += ` ${p2}`;
  if (p3) result += `-${p3}`;
  if (p4) result += `-${p4}`;
  return result;
};

const isValidPhone = (value: string) => /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value);

function Icon({ name, className }: { name: string; className?: string }) {
  const common = "fill-none stroke-current";
  if (name === "phone") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path className={common} strokeWidth="1.8" d="M5 4h3l2 5-2 1.8a13 13 0 0 0 5.2 5.2L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
      </svg>
    );
  }
  if (name === "menu") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path className={common} strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    );
  }
  if (name === "close") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path className={common} strokeWidth="2" d="M6 6l12 12M18 6L6 18" />
      </svg>
    );
  }
  if (name === "arrow") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path className={common} strokeWidth="1.8" d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path className={common} strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (name === "location") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path className={common} strokeWidth="1.8" d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" />
        <circle className={common} cx="12" cy="10" r="2.5" strokeWidth="1.8" />
      </svg>
    );
  }
  if (name === "box") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path className={common} strokeWidth="1.8" d="M3 7l9-4 9 4-9 4-9-4zm0 0v10l9 4 9-4V7" />
      </svg>
    );
  }
  if (name === "factory") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path className={common} strokeWidth="1.8" d="M3 21V9l6 3V9l6 3V5l6 3v13H3z" />
      </svg>
    );
  }
  if (name === "truck") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path className={common} strokeWidth="1.8" d="M2 7h12v8H2zM14 10h4l4 4v1h-8zM6 18a2 2 0 1 1 0 .01M18 18a2 2 0 1 1 0 .01" />
      </svg>
    );
  }
  if (name === "tools") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path className={common} strokeWidth="1.8" d="M4 20l6-6M14 4l6 6-8 8-6-6 8-8z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path className={common} strokeWidth="1.8" d="M4 12h16M12 4v16" />
    </svg>
  );
}

function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <div className="inline-flex items-center gap-3" aria-label="ПРОКАДРЫ">
      <svg viewBox="0 0 56 56" className="h-11 w-11" role="img" aria-hidden="true">
        <rect x="4" y="4" width="48" height="48" rx="10" fill={light ? "#FF7800" : "#FF7800"} />
        <path d="M16 16h8v12h8V16h8v24h-8v-8h-8v8h-8V16z" fill={light ? "#080A0C" : "#080A0C"} />
        <circle cx="20" cy="40" r="3" fill={light ? "#080A0C" : "#080A0C"} />
        <circle cx="28" cy="40" r="3" fill={light ? "#080A0C" : "#080A0C"} />
        <circle cx="36" cy="40" r="3" fill={light ? "#080A0C" : "#080A0C"} />
      </svg>
      <div className="leading-none">
        <p className={`text-xl font-extrabold tracking-[0.06em] ${light ? "text-[#080A0C]" : "text-[#F4F4F2]"}`}>ПРОКАДРЫ</p>
        <p className={`mt-1 text-[10px] font-semibold tracking-[0.2em] ${light ? "text-[#2A2F32]" : "text-[#969DA1]"}`}>
          АУТСОРСИНГ ПЕРСОНАЛА
        </p>
      </div>
    </div>
  );
}

function SectionReveal({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

function Counter({ value, suffix, label }: Stat) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const duration = 1400;
    const started = performance.now();
    const tick = (time: number) => {
      const progress = Math.min((time - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <div ref={ref} className="space-y-2 border-l border-[#2A2F32] pl-6">
      <p className="text-5xl font-extrabold tracking-tight text-[#FF7800] md:text-6xl">{formatRuNumber(count)}{suffix}</p>
      <p className="text-sm text-[#969DA1] md:text-base">{label}</p>
    </div>
  );
}

async function submitLead(payload: unknown) {
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (Math.random() < 0.08) {
    throw new Error("Ошибка сети. Попробуйте еще раз.");
  }
  return { ok: true, endpoint: API_ENDPOINT, payload };
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [slide, setSlide] = useState(0);

  const [quickForm, setQuickForm] = useState({
    staffCount: "20",
    personnelType: "Комплектовщики",
    term: "1–3 месяца",
    region: "",
    phone: "+7",
    comment: "",
  });
  const [quickState, setQuickState] = useState<{ loading: boolean; success: string; error: string }>({
    loading: false,
    success: "",
    error: "",
  });

  const [contactForm, setContactForm] = useState({
    name: "",
    company: "",
    phone: "+7",
    email: "",
    city: "",
    count: "",
    type: "",
    comment: "",
    agree: false,
  });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [contactState, setContactState] = useState<{ loading: boolean; success: string; error: string }>({
    loading: false,
    success: "",
    error: "",
  });

  useEffect(() => {
    document.title = "ПРОКАДРЫ - аутсорсинг персонала для складов и производств";
    const existing = document.querySelector('meta[name="description"]');
    if (existing) {
      existing.setAttribute(
        "content",
        "ПРОКАДРЫ предоставляет персонал для складов, производств и логистических объектов по всей России. Подбор, оформление, вывод и контроль сотрудников."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "ПРОКАДРЫ предоставляет персонал для складов, производств и логистических объектов по всей России. Подбор, оформление, вывод и контроль сотрудников.";
      document.head.appendChild(meta);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % testimonials.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const quickValid = useMemo(() => {
    return quickForm.region.trim().length > 1 && isValidPhone(quickForm.phone);
  }, [quickForm.phone, quickForm.region]);

  const handleQuickSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setQuickState({ loading: false, success: "", error: "" });
    if (!quickValid) {
      setQuickState({ loading: false, success: "", error: "Проверьте город/регион и формат телефона." });
      return;
    }
    try {
      setQuickState({ loading: true, success: "", error: "" });
      await submitLead({ type: "quick", ...quickForm });
      setQuickState({ loading: false, success: "Спасибо! Заявка отправлена.", error: "" });
      setQuickForm((prev) => ({ ...prev, region: "", comment: "", phone: "+7" }));
    } catch (error) {
      setQuickState({ loading: false, success: "", error: (error as Error).message });
    }
  };

  const validateContact = () => {
    const errors: Record<string, string> = {};
    if (!contactForm.name.trim()) errors.name = "Введите имя";
    if (!contactForm.company.trim()) errors.company = "Введите компанию";
    if (!isValidPhone(contactForm.phone)) errors.phone = "Телефон в формате +7 (999) 999-99-99";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) errors.email = "Проверьте email";
    if (!contactForm.city.trim()) errors.city = "Введите город";
    if (!contactForm.count.trim()) errors.count = "Укажите количество сотрудников";
    if (!contactForm.type.trim()) errors.type = "Укажите тип персонала";
    if (!contactForm.agree) errors.agree = "Нужно согласие на обработку данных";
    return errors;
  };

  const handleContactSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setContactState({ loading: false, success: "", error: "" });
    const errors = validateContact();
    setContactErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setContactState({ loading: true, success: "", error: "" });
      await submitLead({ ...contactForm, formType: "contact" });
      setContactState({
        loading: false,
        success: "Заявка отправлена! Спасибо! Специалист ПРОКАДРЫ свяжется с вами для уточнения деталей.",
        error: "",
      });
      setContactForm({
        name: "",
        company: "",
        phone: "+7",
        email: "",
        city: "",
        count: "",
        type: "",
        comment: "",
        agree: false,
      });
      setContactErrors({});
    } catch (error) {
      setContactState({ loading: false, success: "", error: (error as Error).message });
    }
  };

  return (
    <div className="bg-[#080A0C] text-[#F4F4F2] antialiased">
      <img src={IMAGES.hero} alt="" fetchPriority="high" className="hidden" />

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled ? "border-white/10 bg-[#080A0C]/90 backdrop-blur-md" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => scrollToId("hero")} aria-label="На главную" className="text-left">
            <BrandLogo />
          </button>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.href}
                className="text-sm font-medium text-[#969DA1] transition hover:text-[#F4F4F2]"
                onClick={() => scrollToId(item.href)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <div className="flex items-start gap-2">
              <Icon name="phone" className="mt-1 h-4 w-4 text-[#FF7800]" />
              <div>
                <a href="tel:88005553535" className="block text-sm font-semibold text-[#F4F4F2]">8 800 555 35 35</a>
                <p className="text-xs text-[#969DA1]">Звонок бесплатный</p>
              </div>
            </div>
            <button
              onClick={() => scrollToId("quick")}
              className="group inline-flex items-center gap-2 rounded-md bg-[#FF7800] px-5 py-3 text-sm font-semibold text-[#080A0C] transition hover:bg-[#D95F00]"
            >
              Получить расчет
              <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-white/20 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-[#080A0C]/98 p-6 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-10 flex items-center justify-between">
              <BrandLogo />
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded border border-white/20"
                onClick={() => setMenuOpen(false)}
                aria-label="Закрыть меню"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  className="block text-left text-xl font-semibold"
                  onClick={() => {
                    scrollToId(item.href);
                    setMenuOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-10 border-t border-white/10 pt-6">
              <a href="tel:88005553535" className="text-lg font-semibold">8 800 555 35 35</a>
              <p className="text-sm text-[#969DA1]">Звонок бесплатный</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="overflow-x-clip">
        <section id="hero" className="relative min-h-screen pt-20">
          <div className="absolute inset-0">
            <motion.img
              src={IMAGES.hero}
              alt="Современный склад с персоналом"
              className="h-full w-full object-cover"
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080A0C]/95 via-[#080A0C]/75 to-[#080A0C]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080A0C] via-transparent to-[#080A0C]/40" />
          </div>

          <div className="relative mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1280px] flex-col justify-center px-4 pb-20 pt-14 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-14 bg-[#FF7800]" />
                <p className="text-xs font-semibold tracking-[0.18em] text-[#FF7800]">АУТСОРСИНГ ПЕРСОНАЛА</p>
              </div>
              <h1 className="text-4xl font-extrabold uppercase leading-[0.92] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                ЗАКРОЕМ ЛЮБУЮ
                <br />
                ПОТРЕБНОСТЬ
                <br />
                <span className="text-[#FF7800]">В ПЕРСОНАЛЕ</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base text-[#D6D9DA] md:text-lg">
                ПРОКАДРЫ - предоставляем персонал для складов, производств и логистических объектов по всей России.
              </p>
              <div className="mt-6 grid gap-2 text-sm text-[#C2C6C8] sm:grid-cols-3">
                <p>По всей России</p>
                <p>От нескольких сотрудников до крупных команд</p>
                <p>Быстрый вывод персонала</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => scrollToId("quick")}
                  className="group inline-flex items-center gap-2 rounded-md bg-[#FF7800] px-6 py-3 text-sm font-bold text-[#080A0C] transition hover:bg-[#D95F00]"
                >
                  Получить расчет
                  <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => scrollToId("contacts")}
                  className="rounded-md border border-white/25 px-6 py-3 text-sm font-semibold transition hover:border-white/50"
                >
                  Оставить заявку
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 grid max-w-xl gap-3 border-l border-white/15 pl-5 text-sm md:ml-auto md:mt-0"
            >
              {["Оперативный подбор персонала", "Официальное оформление", "Замена сотрудников в кратчайшие сроки", "Полный контроль на объекте"].map((item) => (
                <div key={item} className="flex items-start gap-2 text-[#D8DBDD]">
                  <Icon name="check" className="mt-0.5 h-4 w-4 text-[#FF7800]" />
                  <p>{item}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <SectionReveal className="bg-[#101416] py-16">
          <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            {stats.map((stat) => (
              <Counter key={stat.label} {...stat} />
            ))}
          </div>
          <p className="mx-auto mt-6 w-full max-w-[1280px] px-4 text-xs text-[#6D7377] sm:px-6 lg:px-8">
            Демонстрационные данные: значения легко заменяются на реальные после согласования.
          </p>
        </SectionReveal>

        <SectionReveal id="about" className="bg-[#080A0C] py-20">
          <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#FF7800]">О КОМПАНИИ</p>
              <h2 className="mt-4 text-3xl font-extrabold uppercase leading-tight md:text-4xl">
                ПРОКАДРЫ - ВАШ НАДЕЖНЫЙ ПАРТНЕР
                <br />В СФЕРЕ АУТСОРСИНГА ПЕРСОНАЛА
              </h2>
              <p className="mt-5 max-w-xl text-[#A7AEB2]">
                Мы предоставляем квалифицированный персонал для складов, производств и логистических комплексов по всей России.
                Берем на себя кадровые и операционные вопросы, чтобы вы могли сосредоточиться на развитии бизнеса.
              </p>
              <button className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#FF7800]">
                Узнать больше
                <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            </div>
            <div>
              <img
                src={IMAGES.team}
                alt="Команда сотрудников на складе"
                loading="lazy"
                className="h-[380px] w-full rounded-sm object-cover md:h-[460px]"
              />
              <div className="mt-4 flex justify-between text-[#FF7800]">
                {stats.map((item) => (
                  <p key={item.label} className="text-2xl font-extrabold">{formatRuNumber(item.value)}{item.suffix}</p>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal id="services" className="bg-[#F4F4F2] py-20 text-[#080A0C]">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <h2 className="max-w-4xl text-3xl font-extrabold uppercase leading-tight md:text-5xl">
              КВАЛИФИЦИРОВАННЫЙ ПЕРСОНАЛ
              <br />ДЛЯ ЛЮБЫХ ЗАДАЧ
            </h2>
            <p className="mt-4 max-w-2xl text-[#3B444A]">
              Подберем сотрудников под специфику вашего объекта, график и объем работ.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => (
                <motion.article
                  key={service.title}
                  className="group overflow-hidden rounded-sm border border-[#D5D8D6] bg-white/90"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="h-52 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <Icon name={service.icon} className="h-5 w-5 text-[#FF7800]" />
                    <h3 className="mt-3 text-xl font-bold uppercase">{service.title}</h3>
                    <p className="mt-2 text-sm text-[#3B444A]">{service.description}</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#FF7800]">
                      Подробнее
                      <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal className="bg-[#101416] py-20">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <h2 className="max-w-4xl text-3xl font-extrabold uppercase leading-tight md:text-5xl">
              НЕ ПРОСТО ПРЕДОСТАВЛЯЕМ ЛЮДЕЙ -
              <br />УПРАВЛЯЕМ РЕЗУЛЬТАТОМ
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {[
                ["01", "Большая база сотрудников", "Подбор персонала под разные задачи и объемы"],
                ["02", "Оперативный подбор", "Начинаем работу с заявки без лишней бюрократии"],
                ["03", "Контроль персонала", "Контролируем выход сотрудников и качество работы"],
                ["04", "Гибкие условия", "Подстраиваем количество персонала под потребности объекта"],
              ].map(([num, title, text]) => (
                <div key={num} className="border-t border-white/10 pt-6">
                  <p className="text-5xl font-extrabold text-[#FF7800]">{num}</p>
                  <h3 className="mt-4 text-2xl font-bold">{title}</h3>
                  <p className="mt-2 text-[#9AA1A6]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal id="process" className="bg-[#080A0C] py-20">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold uppercase md:text-5xl">ПРОСТОЙ И ПОНЯТНЫЙ ПРОЦЕСС</h2>

            <div className="mt-12 hidden md:block">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="mb-8 h-px origin-left bg-gradient-to-r from-[#FF7800] to-[#5A2C08]"
              />
              <div className="grid grid-cols-5 gap-4">
                {processSteps.map((step, idx) => (
                  <div key={step.title}>
                    <p className="text-3xl font-extrabold text-[#FF7800]">0{idx + 1}</p>
                    <h3 className="mt-3 text-sm font-bold tracking-wide">{step.title}</h3>
                    <p className="mt-2 text-sm text-[#9AA1A6]">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 space-y-8 md:hidden">
              {processSteps.map((step, idx) => (
                <div key={step.title} className="relative border-l border-[#FF7800]/30 pl-6">
                  {idx !== processSteps.length - 1 && <span className="absolute left-0 top-9 h-16 w-px bg-[#FF7800]/40" />}
                  <p className="text-3xl font-extrabold text-[#FF7800]">0{idx + 1}</p>
                  <h3 className="mt-1 text-sm font-bold tracking-wide">{step.title}</h3>
                  <p className="mt-1 text-sm text-[#9AA1A6]">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal id="guarantees" className="bg-[#F4F4F2] py-20 text-[#080A0C]">
          <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <img src={IMAGES.guarantees} alt="Координатор на складе" loading="lazy" className="h-[420px] w-full rounded-sm object-cover" />
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#D95F00]">ГАРАНТИИ</p>
              <h2 className="mt-4 text-3xl font-extrabold uppercase leading-tight md:text-5xl">
                ВАША УВЕРЕННОСТЬ -
                <br />НАША ОТВЕТСТВЕННОСТЬ
              </h2>
              <div className="mt-8 space-y-3">
                {[
                  "Официальное оформление сотрудников",
                  "Контроль выхода персонала",
                  "Оперативная замена сотрудников",
                  "Контроль дисциплины",
                  "Постоянная коммуникация с заказчиком",
                  "Работа по договору",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[#2F383E]">
                    <Icon name="check" className="mt-0.5 h-4 w-4 text-[#FF7800]" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal className="bg-[#101416] py-20">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold uppercase md:text-5xl">РАБОТАЕМ ПО ВСЕЙ РОССИИ</h2>
            <p className="mt-4 max-w-2xl text-[#9AA1A6]">Подбираем персонал для объектов на всей территории Российской Федерации.</p>
            <div className="relative mt-10 overflow-hidden rounded-sm border border-white/10 bg-[#080A0C] p-4 md:p-8">
              <svg viewBox="0 0 1000 460" className="w-full">
                <path
                  d="M45 229l46-48 38 10 54-25 64 19 72-37 62 17 72-12 77 26 87-13 58 31-29 30-67 17-42-8-53 20-75 10-76 38-67-26-45 5-70-26-84-8z"
                  fill="#181D20"
                  stroke="#2F383E"
                  strokeWidth="2"
                />
                {[
                  [220, 220, "Москва"],
                  [175, 205, "Санкт-Петербург"],
                  [340, 238, "Казань"],
                  [390, 242, "Нижний Новгород"],
                  [520, 252, "Екатеринбург"],
                  [300, 290, "Ростов-на-Дону"],
                  [255, 315, "Краснодар"],
                  [700, 245, "Новосибирск"],
                ].map(([x, y, city]) => (
                  <g key={city as string}>
                    <circle cx={x as number} cy={y as number} r="6" fill="#FF7800" />
                    <text x={(x as number) + 10} y={(y as number) - 10} fill="#C4C8CA" fontSize="16">
                      {city as string}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
              <p className="text-xl font-semibold">Нужен персонал в вашем городе?</p>
              <button
                onClick={() => scrollToId("quick")}
                className="group inline-flex items-center gap-2 rounded-md bg-[#FF7800] px-6 py-3 text-sm font-bold text-[#080A0C] transition hover:bg-[#D95F00]"
              >
                Обсудить задачу
                <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </SectionReveal>

        <section id="quick" className="relative py-20">
          <img src={IMAGES.wide} alt="Склад для формы расчета" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[#080A0C]/85" />
          <div className="relative mx-auto w-full max-w-[920px] px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold uppercase md:text-5xl">РАССЧИТАЙТЕ СТОИМОСТЬ ПЕРСОНАЛА</h2>
            <p className="mt-4 text-[#ABB1B4]">Расскажите о задаче - подготовим индивидуальное предложение.</p>
            <form onSubmit={handleQuickSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-[#C9CDCF]">Количество сотрудников</span>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-sm border border-white/15 bg-[#101416]/80 px-3 py-3 outline-none transition focus:border-[#FF7800]"
                  value={quickForm.staffCount}
                  onChange={(e) => setQuickForm((prev) => ({ ...prev, staffCount: e.target.value }))}
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-[#C9CDCF]">Тип персонала</span>
                <select
                  className="w-full rounded-sm border border-white/15 bg-[#101416]/80 px-3 py-3 outline-none transition focus:border-[#FF7800]"
                  value={quickForm.personnelType}
                  onChange={(e) => setQuickForm((prev) => ({ ...prev, personnelType: e.target.value }))}
                >
                  <option>Комплектовщики</option>
                  <option>Кладовщики</option>
                  <option>Грузчики</option>
                  <option>Разнорабочие</option>
                  <option>Производственный персонал</option>
                  <option>Складской персонал</option>
                  <option>Другое</option>
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-[#C9CDCF]">Срок</span>
                <select
                  className="w-full rounded-sm border border-white/15 bg-[#101416]/80 px-3 py-3 outline-none transition focus:border-[#FF7800]"
                  value={quickForm.term}
                  onChange={(e) => setQuickForm((prev) => ({ ...prev, term: e.target.value }))}
                >
                  <option>До 1 месяца</option>
                  <option>1–3 месяца</option>
                  <option>3–6 месяцев</option>
                  <option>Более 6 месяцев</option>
                  <option>Постоянная потребность</option>
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-[#C9CDCF]">Город / регион</span>
                <input
                  className="w-full rounded-sm border border-white/15 bg-[#101416]/80 px-3 py-3 outline-none transition focus:border-[#FF7800]"
                  value={quickForm.region}
                  onChange={(e) => setQuickForm((prev) => ({ ...prev, region: e.target.value }))}
                  placeholder="Например, Екатеринбург"
                />
              </label>
              <label className="space-y-2 text-sm md:col-span-2">
                <span className="text-[#C9CDCF]">Телефон</span>
                <input
                  className="w-full rounded-sm border border-white/15 bg-[#101416]/80 px-3 py-3 outline-none transition focus:border-[#FF7800]"
                  value={quickForm.phone}
                  onChange={(e) => setQuickForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
                  placeholder="+7 (___) ___-__-__"
                />
              </label>
              <label className="space-y-2 text-sm md:col-span-2">
                <span className="text-[#C9CDCF]">Комментарий</span>
                <textarea
                  rows={4}
                  className="w-full resize-none rounded-sm border border-white/15 bg-[#101416]/80 px-3 py-3 outline-none transition focus:border-[#FF7800]"
                  value={quickForm.comment}
                  onChange={(e) => setQuickForm((prev) => ({ ...prev, comment: e.target.value }))}
                />
              </label>
              <div className="md:col-span-2">
                <button
                  disabled={quickState.loading}
                  className="group inline-flex items-center gap-2 rounded-md bg-[#FF7800] px-6 py-3 text-sm font-bold text-[#080A0C] transition hover:bg-[#D95F00] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {quickState.loading ? "Отправка..." : "Получить расчет"}
                  <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
                {quickState.success && <p className="mt-3 text-sm text-[#87DB95]">{quickState.success}</p>}
                {quickState.error && <p className="mt-3 text-sm text-[#FF9C9C]">{quickState.error}</p>}
              </div>
            </form>
          </div>
        </section>

        <SectionReveal id="cases" className="bg-[#F4F4F2] py-20 text-[#080A0C]">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold uppercase md:text-5xl">НАШИ КЕЙСЫ</h2>
            <p className="mt-4 text-[#3B444A]">Реальные задачи. Конкретные решения. Измеримый результат.</p>
            <p className="mt-2 text-xs text-[#6A7378]">Все кейсы демонстрационные и используются для презентационного макета.</p>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {casesData.map((item) => (
                <article key={item.title} className="overflow-hidden rounded-sm border border-[#D5D8D6] bg-white">
                  <img src={item.image} alt={item.title} loading="lazy" className="h-48 w-full object-cover" />
                  <div className="p-5">
                    <h3 className="text-xl font-bold uppercase">{item.title}</h3>
                    <p className="mt-1 text-sm text-[#D95F00]">{item.city}</p>
                    <div className="mt-4 space-y-3 text-sm text-[#2D353B]">
                      <p><b>Задача:</b> {item.task}</p>
                      <p><b>Решение:</b> {item.solution}</p>
                      <p><b>Результат:</b> {item.result}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </SectionReveal>

        <section id="reviews" className="relative overflow-hidden py-20">
          <img src={IMAGES.logistics} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[#080A0C]/90" />
          <div className="relative mx-auto w-full max-w-[1040px] px-4 sm:px-6">
            <h2 className="text-center text-3xl font-extrabold uppercase md:text-5xl">НАС ВЫБИРАЮТ ЗА РЕЗУЛЬТАТ</h2>
            <p className="mt-3 text-center text-xs text-[#8B9296]">Отзывы временные и легко заменяются на реальные.</p>

            <div className="mt-10">
              <AnimatePresence mode="wait">
                <motion.article
                  key={slide}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.45 }}
                  className="border border-white/15 bg-[#101416]/80 p-8"
                >
                  <p className="text-[#D5D8DA]">{testimonials[slide].text}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#FF7800]">{testimonials[slide].company}</p>
                      <p className="text-sm text-[#A7AEB2]">{testimonials[slide].name}, {testimonials[slide].role}</p>
                    </div>
                    <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/20 md:flex">
                      {slide + 1}
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSlide(idx)}
                      className={`h-2.5 w-8 transition ${idx === slide ? "bg-[#FF7800]" : "bg-white/20"}`}
                      aria-label={`Перейти к отзыву ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="inline-flex h-10 w-10 items-center justify-center border border-white/20"
                    aria-label="Предыдущий отзыв"
                  >
                    <Icon name="arrow" className="h-4 w-4 rotate-180" />
                  </button>
                  <button
                    onClick={() => setSlide((prev) => (prev + 1) % testimonials.length)}
                    className="inline-flex h-10 w-10 items-center justify-center border border-white/20"
                    aria-label="Следующий отзыв"
                  >
                    <Icon name="arrow" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20">
          <img src={IMAGES.wide} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[#080A0C]/84" />
          <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold uppercase text-[#FF7800]">НУЖЕН ПЕРСОНАЛ?</h2>
            <p className="mt-2 text-4xl font-extrabold uppercase leading-none md:text-7xl">ЗАКРОЕМ ВАШУ ПОТРЕБНОСТЬ.</p>
            <p className="mt-4 max-w-xl text-[#B5BBC0]">Расскажите о задаче - подберем оптимальное решение под ваш объект.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => scrollToId("quick")}
                className="group inline-flex items-center gap-2 rounded-md bg-[#FF7800] px-6 py-3 text-sm font-bold text-[#080A0C] transition hover:bg-[#D95F00]"
              >
                Получить расчет
                <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
              <a href="tel:88005553535" className="rounded-md border border-white/25 px-6 py-3 text-sm font-semibold transition hover:border-white/50">
                Позвонить нам
              </a>
            </div>
          </div>
        </section>

        <SectionReveal id="contacts" className="bg-[#101416] py-20">
          <div className="mx-auto w-full max-w-[920px] px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold uppercase md:text-5xl">ОСТАВЬТЕ ЗАЯВКУ</h2>
            <form onSubmit={handleContactSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                ["name", "Имя", "text"],
                ["company", "Компания", "text"],
                ["phone", "Телефон", "tel"],
                ["email", "Email", "email"],
                ["city", "Город", "text"],
                ["count", "Количество сотрудников", "number"],
                ["type", "Тип персонала", "text"],
              ].map(([field, label, inputType]) => (
                <label key={field} className={`space-y-2 text-sm ${field === "type" ? "md:col-span-2" : ""}`}>
                  <span className="text-[#C9CDCF]">{label}</span>
                  <input
                    type={inputType}
                    value={contactForm[field as keyof typeof contactForm] as string}
                    onChange={(e) => {
                      const nextValue = field === "phone" ? formatPhone(e.target.value) : e.target.value;
                      setContactForm((prev) => ({ ...prev, [field]: nextValue }));
                    }}
                    className={`w-full rounded-sm border bg-[#080A0C] px-3 py-3 outline-none transition focus:border-[#FF7800] ${
                      contactErrors[field] ? "border-[#FF9C9C]" : "border-white/15"
                    }`}
                  />
                  {contactErrors[field] && <p className="text-xs text-[#FF9C9C]">{contactErrors[field]}</p>}
                </label>
              ))}

              <label className="space-y-2 text-sm md:col-span-2">
                <span className="text-[#C9CDCF]">Комментарий</span>
                <textarea
                  rows={4}
                  value={contactForm.comment}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, comment: e.target.value }))}
                  className="w-full resize-none rounded-sm border border-white/15 bg-[#080A0C] px-3 py-3 outline-none transition focus:border-[#FF7800]"
                />
              </label>

              <label className="flex items-start gap-3 text-sm md:col-span-2">
                <input
                  type="checkbox"
                  checked={contactForm.agree}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, agree: e.target.checked }))}
                  className="mt-1 h-4 w-4 accent-[#FF7800]"
                />
                <span>Я согласен на обработку персональных данных</span>
              </label>
              {contactErrors.agree && <p className="-mt-2 text-xs text-[#FF9C9C] md:col-span-2">{contactErrors.agree}</p>}

              <div className="md:col-span-2">
                <button
                  disabled={contactState.loading}
                  className="group inline-flex items-center gap-2 rounded-md bg-[#FF7800] px-6 py-3 text-sm font-bold text-[#080A0C] transition hover:bg-[#D95F00] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {contactState.loading ? "Отправка..." : "Отправить заявку"}
                  <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
                {contactState.success && <p className="mt-3 text-sm text-[#87DB95]">{contactState.success}</p>}
                {contactState.error && <p className="mt-3 text-sm text-[#FF9C9C]">{contactState.error}</p>}
                <p className="mt-4 text-xs text-[#697176]">Интеграция CRM/Telegram/Email/API подключается через endpoint: {API_ENDPOINT}</p>
              </div>
            </form>
          </div>
        </SectionReveal>
      </main>

      <footer className="border-t border-white/10 bg-[#050607] py-14">
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2">
            <BrandLogo />
            <p className="mt-4 max-w-sm text-sm text-[#8E969B]">Аутсорсинг персонала для складов, производств и логистики</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-[#FF7800]">КОМПАНИЯ</p>
            <div className="mt-3 space-y-2 text-sm text-[#A0A7AB]">
              <button onClick={() => scrollToId("about")} className="block hover:text-white">О компании</button>
              <button onClick={() => scrollToId("services")} className="block hover:text-white">Преимущества</button>
              <button onClick={() => scrollToId("cases")} className="block hover:text-white">Кейсы</button>
              <button onClick={() => scrollToId("reviews")} className="block hover:text-white">Отзывы</button>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-[#FF7800]">УСЛУГИ</p>
            <div className="mt-3 space-y-2 text-sm text-[#A0A7AB]">
              <p>Складской персонал</p>
              <p>Производственный персонал</p>
              <p>Грузчики</p>
              <p>Разнорабочие</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-[#FF7800]">ИНФОРМАЦИЯ</p>
            <div className="mt-3 space-y-2 text-sm text-[#A0A7AB]">
              <button onClick={() => scrollToId("process")} className="block hover:text-white">Как работаем</button>
              <button onClick={() => scrollToId("guarantees")} className="block hover:text-white">Гарантии</button>
              <button onClick={() => scrollToId("contacts")} className="block hover:text-white">Контакты</button>
              <a href="tel:88005553535" className="block text-white">8 800 555 35 35</a>
              <a href="mailto:info@prokadry.ru" className="block text-white">info@prokadry.ru</a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 pt-6 text-xs text-[#6C7377] sm:px-6 lg:px-8">
          <p>© ПРОКАДРЫ, 2026</p>
          <p>Политика конфиденциальности</p>
          <p>Согласие на обработку персональных данных</p>
        </div>
      </footer>

      <button
        onClick={() => scrollToId("quick")}
        className="fixed bottom-4 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 rounded-md bg-[#FF7800] px-5 py-3 text-sm font-bold text-[#080A0C] shadow-lg shadow-black/30 md:hidden"
      >
        Получить расчет
        <Icon name="arrow" className="h-4 w-4" />
      </button>
    </div>
  );
}
