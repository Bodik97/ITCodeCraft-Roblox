import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitLead } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import {
  Menu, X, Gamepad2, Swords, Factory, CarFront,
  Users, DollarSign, Code2, ShieldCheck, CheckCircle2,
  Star, Play, Monitor, ChevronLeft, ChevronRight, Trophy, Flame
} from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

import gameObbyImg from "../assets/game-obby.png";
import gameBattleImg from "../assets/game-battle.png";
import gameTycoonImg from "../assets/game-tycoon.png";
import gameRacingImg from "../assets/game-racing.png";
import mentorOleksiyImg from "../assets/mentor-oleksiy.png";
import mentorMariiaImg from "../assets/mentor-mariia.png";
import mentorDenysImg from "../assets/mentor-denys.png";
import sgZombieImg from "../assets/sg-zombie.png";
import sgSkyImg from "../assets/sg-sky.png";
import sgCityImg from "../assets/sg-city.png";
import sgDragonImg from "../assets/sg-dragon.png";
import sgPizzaImg from "../assets/sg-pizza.png";
import sgSpaceImg from "../assets/sg-space.png";

// ─────────────────── DATA ───────────────────
const GAMES_SHOWCASE = [
  { img: gameObbyImg, icon: <Gamepad2 size={20} className="text-[#00A2FF]" />, title: "Obby", duration: "2 уроки", difficulty: "Початковий", diffColor: "bg-emerald-100 text-emerald-700", desc: "Стрибай через перешкоди, збирай монети — перша гра за 2 уроки" },
  { img: gameBattleImg, icon: <Swords size={20} className="text-destructive" />, title: "Battle Arena", duration: "4 уроки", difficulty: "Середній", diffColor: "bg-amber-100 text-amber-700", desc: "Бій гравців: зброя, HP, respawn — повноцінний мультиплеєр" },
  { img: gameTycoonImg, icon: <Factory size={20} className="text-[#FBBF24]" />, title: "Tycoon", duration: "6 уроків", difficulty: "Середній", diffColor: "bg-amber-100 text-amber-700", desc: "Будуй завод, заробляй, розширюй свою ігрову імперію" },
  { img: gameRacingImg, icon: <CarFront size={20} className="text-[#00B06F]" />, title: "Racing", duration: "5 уроків", difficulty: "Просунутий", diffColor: "bg-red-100 text-red-700", desc: "Гоночна траса: фізика авто, checkpoint-и, рекорди часу" },
];

const WHY_ROBLOX = [
  { icon: <Users size={36} className="text-[#6366F1]" />, stat: "70 млн", sub: "дітей грають у Roblox щодня", desc: "Найбільший ігровий майданчик світу" },
  { icon: <DollarSign size={36} className="text-[#FBBF24]" />, stat: "$1M+/рік", sub: "заробляють топ-розробники", desc: "Реальна IT-кар'єра вже з підліткового віку" },
  { icon: <Code2 size={36} className="text-[#00A2FF]" />, stat: "Lua → Python", sub: "справжнє програмування", desc: "Місток до Python, JavaScript та C#" },
  { icon: <ShieldCheck size={36} className="text-[#00B06F]" />, stat: "Safe", sub: "безпечне середовище", desc: "Модерація платформи + контроль куратора на кожному уроці" },
];

const TIMELINE = [
  { step: "Урок 1", title: "Знайомство з Roblox Studio", desc: "Інтерфейс, перший Part, налаштування середовища" },
  { step: "Уроки 2–4", title: "Перша Obby-гра", desc: "Платформи, checkpoint-и, публікація в Roblox" },
  { step: "Уроки 5–8", title: "Мова Lua", desc: "Змінні, умови, події, перший скрипт" },
  { step: "Уроки 9–14", title: "Велика гра", desc: "Tycoon або Battle Arena — повноцінний проєкт" },
  { step: "Урок 15", title: "Публікація!", desc: "Гра виходить у Roblox. Друзі вже грають" },
];

const STUDENT_GAMES = [
  { img: sgZombieImg, name: "Zombie Tycoon", student: "Максим", age: 12, visits: 8420, rating: 4.8, top: true },
  { img: sgSkyImg, name: "Sky Obby", student: "Соня", age: 10, visits: 5100, rating: 4.9, top: true },
  { img: sgCityImg, name: "City Racing", student: "Артем", age: 13, visits: 12300, rating: 4.7, top: false },
  { img: sgDragonImg, name: "Dragon Arena", student: "Даша", age: 11, visits: 3780, rating: 4.6, top: false },
  { img: sgPizzaImg, name: "Pizza Tycoon", student: "Олег", age: 14, visits: 6900, rating: 4.9, top: true },
  { img: sgSpaceImg, name: "Space Obby", student: "Аня", age: 9, visits: 2450, rating: 4.8, top: false },
];

const BENEFITS = [
  "Власна опублікована гра в Roblox",
  "Сертифікат ITCodeCraft Roblox Developer",
  "Закрита Discord-спільнота",
  "Знання Lua + основи ООП",
  "Розуміння game design",
  "PDF «10 ідей ігор для початківців»",
];

const TESTIMONIALS = [
  { initials: "КД", name: "Катерина Д.", sub: "мама Максима, 12р.", text: "Максим тепер замість того, щоб просто грати, пояснює мені, як влаштована гра. Куратор завжди відповідає на запитання." },
  { initials: "ІР", name: "Ігор Р.", sub: "тато Сашка, 10р.", text: "Думав, що це ще одна «ігрова» школа. Але Саша дійсно вчить код! Вже розуміє змінні та функції." },
  { initials: "ОМ", name: "Олена М.", sub: "мама Даші, 11р.", text: "Даша плакала перед першим уроком, а тепер сама просить додатковий. Програмування більше не лякає." },
  { initials: "Т", name: "Тимур, 13р.", sub: "учень", text: "Я зробив Battle Arena і мої друзі грають у неї! Це найкраще, що зі мною траплялося." },
  { initials: "А", name: "Аня, 10р.", sub: "учень", text: "Раніше я думала, що програмування — це нудно. Тепер я роблю свої ігри і вчу подругу." },
];

const MENTORS = [
  { img: mentorOleksiyImg, name: "Олексій К.", role: "Roblox Game Developer", years: "5 років", games: "23 гри", visits: "2.1M відвідувань", quote: "Я навчаю так, як хотів би, щоб навчили мене — через практику і реальні ігри." },
  { img: mentorMariiaImg, name: "Марія Ш.", role: "Lua Developer", years: "4 роки", games: "14 ігор", visits: "890K відвідувань", quote: "Дітям потрібно бачити результат одразу. Тому вже на першому уроці ми щось публікуємо." },
  { img: mentorDenysImg, name: "Денис В.", role: "Game Designer", years: "6 років", games: "31 гра", visits: "3.7M відвідувань", quote: "Game design — це не просто малювати карти. Це думати, як гравець." },
];

const FAQS = [
  { q: "Чи безпечний Roblox?", a: "Так. Roblox має власну модерацію контенту. Куратори стежать за тим, з ким спілкується дитина під час занять." },
  { q: "Чи потрібні Robux?", a: "Ні. Roblox Studio — безкоштовний. Для навчання Robux не потрібні." },
  { q: "Який комп'ютер потрібен?", a: "Windows або Mac, від 4 ГБ RAM та Intel Core i3. Roblox Studio запускається навіть на старих ноутбуках." },
  { q: "Скільки часу до публікації першої гри?", a: "Вже після 2–3 уроків дитина публікує першу Obby. Повноцінна гра — через 6–8 уроків." },
  { q: "Що, якщо дитина любить тільки грати?", a: "Це найкращий старт! Дитина вже знає ігрові механіки — залишається навчити її їх програмувати." },
  { q: "Чи підійде без досвіду?", a: "Так. Курс розрахований на абсолютних початківців. Жодного попереднього знання коду не потрібно." },
  { q: "Скільки коштує курс?", a: "Перший урок безкоштовний. Повний курс — 15 уроків. Ціну дізнайтесь після безкоштовного уроку в куратора." },
  { q: "Що на безкоштовному уроці?", a: "Знайомство з Roblox Studio, перший скрипт на Lua, та відповіді на всі ваші запитання. Без тиску і зобов'язань." },
];

// ─────────────────── SCHEMA ───────────────────
const leadSchema = z.object({
  parentName: z.string().min(2, "Введіть коректне ім'я"),
  phone: z.string().regex(/^(\+?380|0)\d{9}$/, "Невірний формат (наприклад: 0501234567)"),
  childAge: z.coerce.number().min(7).max(17),
});

// ─────────────────── HERO PARTICLES ───────────────────
const PARTICLES = [
  { size: 8, left: "12%", delay: "0s", duration: "14s", color: "#6366F1" },
  { size: 5, left: "28%", delay: "2.5s", duration: "11s", color: "#FBBF24" },
  { size: 10, left: "45%", delay: "1.2s", duration: "16s", color: "#00A2FF" },
  { size: 6, left: "63%", delay: "4s", duration: "13s", color: "#00B06F" },
  { size: 8, left: "78%", delay: "0.8s", duration: "15s", color: "#6366F1" },
  { size: 4, left: "90%", delay: "3.2s", duration: "12s", color: "#EF4444" },
  { size: 7, left: "20%", delay: "6s", duration: "17s", color: "#FBBF24" },
  { size: 5, left: "55%", delay: "5.1s", duration: "14s", color: "#00A2FF" },
];

// ─────────────────── COUNT-UP HOOK ───────────────────
function useCountUp(target: number, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ─────────────────── ANIMATED STAT ───────────────────
function AnimStat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div className="stat-pill flex flex-col items-center min-w-32.5">
      <span ref={ref as React.Ref<HTMLSpanElement>} className="text-3xl font-display font-bold text-white">
        {count.toLocaleString("uk-UA")}{suffix}
      </span>
      <span className="text-slate-400 text-xs mt-1 font-medium">{label}</span>
    </div>
  );
}

// ─────────────────── CSS ROBLOX CHARACTER ───────────────────
const RobloxCharacter = () => (
  <div className="relative w-56 h-72 floating mx-auto select-none" aria-hidden="true">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#FBBF24] border-4 border-[#0F172A] rounded-2xl z-20 flex flex-col items-center justify-center gap-1">
      <div className="flex gap-3">
        <div className="w-3 h-3 bg-[#0F172A] rounded-full"></div>
        <div className="w-3 h-3 bg-[#0F172A] rounded-full"></div>
      </div>
      <div className="w-7 h-0.75 bg-[#0F172A] rounded-full mt-1"></div>
    </div>
    <div className="absolute top-19 left-1/2 -translate-x-1/2 w-28 h-32 bg-[#00A2FF] border-4 border-[#0F172A] rounded-2xl z-10 flex items-center justify-center">
      <div className="w-14 h-14 border-4 border-[#0F172A]/40 rounded-xl"></div>
    </div>
    <div className="absolute top-21 left-2.5 w-10 h-24 bg-[#FBBF24] border-4 border-[#0F172A] rounded-2xl -rotate-6 z-0 origin-top"></div>
    <div className="absolute top-21 right-2.5 w-10 h-24 bg-[#FBBF24] border-4 border-[#0F172A] rounded-2xl rotate-6 z-0 origin-top"></div>
    <div className="absolute top-49 left-1/2 -translate-x-8.5 w-10 h-20 bg-[#6366F1] border-4 border-[#0F172A] rounded-2xl z-0"></div>
    <div className="absolute top-49 left-1/2 translate-x-1 w-10 h-20 bg-[#6366F1] border-4 border-[#0F172A] rounded-2xl z-0"></div>
    <div className="absolute -top-3 -left-6 w-7 h-7 bg-[#00B06F] border-2 border-[#0F172A] rounded-lg floating" style={{ animationDelay: "0.4s" }}></div>
    <div className="absolute top-1/2 -right-10 w-9 h-9 bg-[#6366F1] border-2 border-[#0F172A] rounded-lg floating" style={{ animationDelay: "0.8s" }}></div>
    <div className="absolute bottom-2 -left-10 w-10 h-10 bg-[#FBBF24] border-2 border-[#0F172A] rounded-lg floating" style={{ animationDelay: "1.2s" }}></div>
    <div className="absolute -top-6 right-0 w-6 h-6 bg-destructive border-2 border-[#0F172A] rounded-md floating" style={{ animationDelay: "0.2s" }}></div>
  </div>
);

// ─────────────────── STARS ───────────────────
const Stars = ({ n = 5, size = 14 }: { n?: number; size?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={size} className={i < n ? "text-[#FBBF24] fill-[#FBBF24]" : "text-slate-600"} />
    ))}
  </div>
);

// ─────────────────── STUDENT GAME CARD ───────────────────
function StudentGameCard({ game }: { game: typeof STUDENT_GAMES[0] }) {
  return (
    <article className="game-card">
      <div className="relative h-44 overflow-hidden">
        <img
          src={game.img}
          alt={`Гра учня ${game.student}: ${game.name}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent" />
        {/* badges row */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <span className="badge-published">PUBLISHED</span>
          {game.top && (
            <span className="flex items-center gap-1 bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#FBBF24] text-[10px] font-bold px-2 py-1 rounded-full">
              <Trophy size={10} /> ТОП
            </span>
          )}
        </div>
        {/* title over image bottom */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-bold text-white text-lg leading-tight drop-shadow">{game.name}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#6366F1]/20 flex items-center justify-center text-[10px] font-bold text-[#6366F1] uppercase">
              {game.student[0]}
            </div>
            <span className="text-slate-300 text-sm">{game.student}, {game.age}р.</span>
          </div>
          <Stars n={Math.round(game.rating)} size={12} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#00A2FF] text-sm font-bold">
            <Flame size={13} className="text-[#FBBF24]" />
            {game.visits.toLocaleString("uk-UA")} візитів
          </div>
          <span className="text-slate-500 text-xs">{game.rating}/5.0</span>
        </div>
      </div>
    </article>
  );
}

// ─────────────────── MAIN COMPONENT ───────────────────
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-reveal observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".fade-in-up, .timeline-line").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.title = "Roblox Studio для дітей 8–16 років | Школа програмування ITCodeCraft";
  }, []);

  const leadMutation = useSubmitLead({
    mutation: {
      onSuccess: () => { toast({ title: "Заявку прийнято!", description: "Ми зателефонуємо вам найближчим часом." }); form.reset(); },
      onError: () => { toast({ title: "Помилка", description: "Щось пішло не так. Спробуйте ще раз.", variant: "destructive" }); }
    }
  });

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { parentName: "", phone: "", childAge: 10 },
  });

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); };
  const prevT = () => setTestimonialIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const nextT = () => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length);

  // duplicate student games for seamless marquee
  const row1 = [...STUDENT_GAMES, ...STUDENT_GAMES];
  const row2 = [...[...STUDENT_GAMES].reverse(), ...[...STUDENT_GAMES].reverse()];

  return (
    <div className="min-h-dvh flex flex-col font-sans">
      {/* SCROLL PROGRESS */}
      <div className="scroll-progress" style={{ "--scroll-progress": `${scrollPct}%` } as React.CSSProperties} aria-hidden="true" />

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white focus:z-100 focus:text-[#6366F1] focus:font-bold">
        Перейти до головного контенту
      </a>

      {/* ══ 1. HEADER ══ */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Logo size="sm" variant="light" href="https://itcodecraft.tech/" className="min-w-0" />
            <span className="bg-[#00A2FF] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">Roblox Edition</span>
          </div>
          <nav className="hidden md:flex items-center gap-5" aria-label="Навігація">
            {[["course","Курс"],["games","Ігри учнів"],["how-it-works","Як проходить"],["mentors","Викладачі"],["faq","FAQ"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-sm font-medium text-slate-500 hover:text-[#0F172A] transition-colors">{label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => scrollTo("cta")} data-testid="button-header-cta" className="hidden sm:inline-flex px-5 py-2 rounded-xl font-bold text-sm btn-3d-amber">
              Безкоштовний урок
            </button>
            <button className="md:hidden p-2 text-[#0F172A]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Закрити меню" : "Відкрити меню"}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-xl py-4 px-4 flex flex-col gap-1">
            {[["course","Курс"],["games","Ігри учнів"],["how-it-works","Як проходить"],["mentors","Викладачі"],["faq","FAQ"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-left font-medium px-3 py-2 rounded-lg hover:bg-slate-50">{label}</button>
            ))}
            <button onClick={() => scrollTo("cta")} className="w-full mt-2 py-3 rounded-xl font-bold btn-3d-amber text-center">Безкоштовний урок</button>
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1">

        {/* ══ 2. HERO ══ */}
        <section className="bg-[#0F172A] text-white pt-16 pb-20 overflow-hidden relative">
          {/* Floating particles */}
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="hero-particle"
              style={{
                width: p.size, height: p.size,
                left: p.left, bottom: "-20px",
                background: p.color,
                animationDelay: p.delay,
                animationDuration: p.duration,
                opacity: 0,
              }}
              aria-hidden="true"
            />
          ))}
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-[#00B06F] animate-pulse"></span>
                Створюй ігри, в які грають мільйони
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Твоя дитина створить свою першу гру в{" "}
                <span className="text-[#00A2FF]" style={{ textShadow: "0 0 32px rgba(0,162,255,0.4)" }}>Roblox</span>{" "}
                за 1 урок
              </h1>
              <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                Навчаємо програмуванню в Roblox Studio мовою Lua. Діти 8–16 років створюють і публікують власні ігри в один з найбільших ігрових світів планети.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => scrollTo("cta")} data-testid="button-hero-cta-primary" className="px-7 py-4 rounded-xl font-display font-bold text-base btn-3d-amber">
                  Записатись на безкоштовний урок
                </button>
                <button onClick={() => scrollTo("games")} data-testid="button-hero-cta-secondary" className="px-7 py-4 rounded-xl font-bold text-base bg-white/10 hover:bg-white/20 transition-colors border border-white/20 flex items-center justify-center gap-2">
                  <Play size={16} /> Ігри учнів
                </button>
              </div>
              <div className="flex flex-wrap gap-6 pt-2 text-sm font-medium text-slate-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#00B06F]" /> 60 хв</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#00B06F]" /> Безкоштовно</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#00B06F]" /> 500+ учнів</span>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <RobloxCharacter />
            </div>
          </div>
        </section>

        {/* ══ 3. SOCIAL PROOF TICKER ══ */}
        <div className="bg-[#1E293B] border-b border-slate-700/60 py-3 overflow-hidden">
          <div className="ticker-track">
            {[1, 2].map(rep => (
              <React.Fragment key={rep}>
                {["47 опублікованих ігор","12 400+ візитів","3 учні в ТОП-100 тижня","4.9/5 від батьків","500+ учнів навчилось","47 опублікованих ігор","12 400+ візитів","3 учні в ТОП-100 тижня"].map((item, i) => (
                  <span key={`${rep}-${i}`} className="flex items-center gap-3 text-slate-300 text-sm font-medium whitespace-nowrap px-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] inline-block"></span>
                    {item}
                  </span>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ══ 4. GAMES SHOWCASE ══ */}
        <section id="course" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14 fade-in-up">
              <span className="inline-block bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">Програма курсу</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#0F172A] mb-3">Що ти створиш?</h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">Від простих смуг перешкод до складних ігрових симуляторів</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {GAMES_SHOWCASE.map((game, i) => (
                <div key={i} className="fade-in-up course-card rounded-2xl border-2 border-slate-100 bg-white overflow-hidden group" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="relative h-44 overflow-hidden">
                    <img src={game.img} alt={`Приклад гри: ${game.title}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold text-[#6366F1]">{game.duration}</span>
                      <span className={`${game.diffColor} px-2 py-0.5 rounded-full text-xs font-bold`}>{game.difficulty}</span>
                    </div>
                  </div>
                  <div className="p-5 flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0 mt-0.5 group-hover:bg-[#6366F1]/10 transition-colors">{game.icon}</div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-[#0F172A] mb-1">{game.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{game.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 5. WHY ROBLOX ══ */}
        <section className="py-20 bg-[#F9FAFB]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14 fade-in-up">
              <span className="inline-block bg-[#00A2FF]/10 text-[#00A2FF] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">Для батьків</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#0F172A] mb-3">Чому Roblox — це більше, ніж гра</h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">Для дитини це гра. Для батьків — потужний інструмент розвитку</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {WHY_ROBLOX.map((item, i) => (
                <div key={i} className="fade-in-up bg-white p-7 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex justify-center mb-5 p-4 bg-slate-50 group-hover:bg-[#6366F1]/5 rounded-2xl w-fit mx-auto transition-colors">{item.icon}</div>
                  <div className="text-2xl font-display font-bold text-[#0F172A] mb-1">{item.stat}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">{item.sub}</div>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 6. HOW IT WORKS ══ */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-14 fade-in-up">
              <span className="inline-block bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">Програма</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#0F172A] mb-3">Шлях від нуля до власної гри</h2>
              <p className="text-slate-500 text-lg">15 уроків. Перша публікація — вже на 3-му</p>
            </div>
            <div className="relative" ref={timelineRef}>
              <div className="timeline-line"></div>
              <div className="absolute left-4.75 top-0 bottom-0 w-0.5 bg-slate-100"></div>
              <div className="space-y-6">
                {TIMELINE.map((item, i) => (
                  <div key={i} className="fade-in-up relative flex gap-6 items-start group" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="relative z-10 w-10 h-10 rounded-xl bg-[#6366F1] text-white font-bold text-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200" style={{ boxShadow: "0 3px 0 #3730a3" }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 bg-white border-2 border-slate-100 group-hover:border-[#6366F1]/40 rounded-2xl p-5 transition-colors duration-200">
                      <div className="text-[10px] font-bold text-[#6366F1] uppercase tracking-widest mb-1">{item.step}</div>
                      <h3 className="text-base font-display font-bold text-[#0F172A] mb-0.5">{item.title}</h3>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                      {i === TIMELINE.length - 1 && (
                        <div className="mt-2 inline-flex items-center gap-1.5 text-[#FBBF24] text-xs font-bold">
                          <Trophy size={12} /> Мета курсу!
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 7. STUDENT GAMES — MARQUEE ══ */}
        <section id="games" className="py-20 bg-[#0B1120] text-white relative overflow-hidden scan-line-bg">
          {/* Background glow orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6366F1]/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#00A2FF]/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-10 fade-in-up">
              <span className="inline-block bg-white/8 text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-white/10">Галерея учнів</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Реальні ігри наших учнів
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">Вони вже розробили свої ігри — і їх грають справжні гравці по всьому світу</p>
            </div>

            {/* Animated stats */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 fade-in-up">
              <AnimStat value={47} label="ігор опубліковано" />
              <AnimStat value={50700} label="сумарно візитів" suffix="+" />
              <AnimStat value={500} label="учнів пройшло курс" suffix="+" />
              <AnimStat value={49} label="середній рейтинг" suffix="/5" />
            </div>
          </div>

          {/* MARQUEE ROW 1 */}
          <div className="marquee-outer mb-5">
            <div className="marquee-track py-2">
              {row1.map((game, i) => (
                <StudentGameCard key={i} game={game} />
              ))}
            </div>
          </div>

          {/* MARQUEE ROW 2 (reverse) */}
          <div className="marquee-outer">
            <div className="marquee-track-rev py-2">
              {row2.map((game, i) => (
                <StudentGameCard key={i} game={game} />
              ))}
            </div>
          </div>

          <div className="text-center mt-12 relative z-10">
            <p className="text-slate-400 text-sm mb-6">Кожна гра — справжній проєкт учня, доступний у Roblox</p>
            <button onClick={() => scrollTo("cta")} className="px-10 py-4 rounded-xl font-display font-bold text-base btn-3d-amber inline-flex items-center gap-2">
              Створити свою гру
            </button>
          </div>
        </section>

        {/* ══ 8. BENEFITS ══ */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="fade-in-up bg-[#6366F1]/5 border-2 border-[#6366F1]/15 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-10">
                <span className="inline-block bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">Результати</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-[#0F172A]">Що отримає учень після курсу?</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {BENEFITS.map((benefit, i) => (
                  <div key={i} className="fade-in-up flex items-center gap-3 bg-white rounded-xl p-4 border border-[#6366F1]/10 shadow-sm hover:shadow-md hover:border-[#6366F1]/30 transition-all" style={{ animationDelay: `${i * 60}ms` }}>
                    <CheckCircle2 className="text-[#00B06F] shrink-0" size={22} />
                    <span className="font-medium text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 9. TESTIMONIALS ══ */}
        <section className="py-20 bg-[#F9FAFB] overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14 fade-in-up">
              <span className="inline-block bg-[#FBBF24]/20 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">Відгуки</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#0F172A]">Батьки та учні про курс</h2>
            </div>
            <div className="max-w-3xl mx-auto fade-in-up">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${testimonialIdx * 100}%)` }}>
                  {TESTIMONIALS.map((t, i) => (
                    <div key={i} className="w-full shrink-0">
                      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mx-1">
                        <div className="flex gap-0.5 mb-4">
                          {Array.from({length:5}).map((_,s) => <Star key={s} size={16} className="text-[#FBBF24] fill-[#FBBF24]" />)}
                        </div>
                        <p className="text-slate-700 text-lg italic leading-relaxed my-5">"{t.text}"</p>
                        <div className="flex items-center gap-4 border-t border-slate-100 pt-5">
                          <div className="w-12 h-12 rounded-full bg-[#6366F1]/10 border-2 border-[#6366F1]/20 flex items-center justify-center font-bold text-[#6366F1] shrink-0 text-sm">{t.initials}</div>
                          <div>
                            <p className="font-bold text-[#0F172A]">{t.name}</p>
                            <p className="text-slate-400 text-sm">{t.sub}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center items-center gap-4 mt-6">
                <button onClick={prevT} aria-label="Попередній" className="p-2 rounded-full border-2 border-slate-200 hover:border-[#6366F1] hover:text-[#6366F1] transition-colors"><ChevronLeft size={18} /></button>
                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, i) => (
                    <button key={i} onClick={() => setTestimonialIdx(i)} aria-label={`Відгук ${i+1}`} className={`rounded-full transition-all duration-300 ${i === testimonialIdx ? "w-6 h-2 bg-[#6366F1]" : "w-2 h-2 bg-slate-300"}`} />
                  ))}
                </div>
                <button onClick={nextT} aria-label="Наступний" className="p-2 rounded-full border-2 border-slate-200 hover:border-[#6366F1] hover:text-[#6366F1] transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 10. MENTORS ══ */}
        <section id="mentors" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14 fade-in-up">
              <span className="inline-block bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">Команда</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#0F172A] mb-3">Викладачі-практики</h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">Вчаться у тих, хто сам створює популярні ігри</p>
            </div>
            <div className="grid md:grid-cols-3 gap-7 max-w-5xl mx-auto">
              {MENTORS.map((m, i) => (
                <div key={i} className="fade-in-up bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img src={m.img} alt={`Викладач ${m.name}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="font-display font-bold text-white text-lg">{m.name}</p>
                      <p className="text-[#00A2FF] text-sm font-bold">{m.role}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <span className="text-xs bg-[#6366F1]/10 text-[#6366F1] px-2.5 py-1 rounded-full font-bold">{m.years}</span>
                      <span className="text-xs bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full font-bold">{m.games}</span>
                      <span className="text-xs bg-[#00B06F]/10 text-[#00B06F] px-2.5 py-1 rounded-full font-bold">{m.visits}</span>
                    </div>
                    <blockquote className="text-slate-600 text-sm italic leading-relaxed border-l-2 border-[#6366F1]/30 pl-3">"{m.quote}"</blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 11. FAQ ══ */}
        <section id="faq" className="py-20 bg-[#F9FAFB]">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-14 fade-in-up">
              <span className="inline-block bg-[#00A2FF]/10 text-[#00A2FF] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">FAQ</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#0F172A]">Часті запитання</h2>
            </div>
            <div className="fade-in-up bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-slate-100">
                    <AccordionTrigger className="text-left font-display font-bold text-base hover:text-[#6366F1] py-4">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-4">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ══ 12. FINAL CTA + FORM ══ */}
        <section id="cta" className="py-20 bg-[#0F172A] text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#6366F1]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#FBBF24]/8 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="fade-in-up space-y-6">
                <span className="inline-block bg-[#FBBF24]/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Безкоштовно</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight">Перетвори улюблену гру на перший проєкт</h2>
                <p className="text-slate-300 text-lg">Залиш заявку — ми зателефонуємо та домовимось про зручний час.</p>
                <div className="space-y-3">
                  {[
                    { icon: <CheckCircle2 size={18} className="text-[#00B06F]" />, text: "Безкоштовно та без зобов'язань" },
                    { icon: <Monitor size={18} className="text-[#00A2FF]" />, text: "Онлайн у зручний час" },
                    { icon: <Star size={18} className="text-[#FBBF24] fill-[#FBBF24]" />, text: "Перша гра вже на 1-му уроці" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">{row.icon}</div>
                      <span className="text-slate-300 font-medium">{row.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="fade-in-up bg-white rounded-3xl p-8 shadow-2xl text-[#0F172A]">
                <h3 className="text-xl font-display font-bold mb-1 text-center">Реєстрація на урок</h3>
                <p className="text-slate-400 text-sm text-center mb-6">Ми зателефонуємо протягом дня</p>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(values => leadMutation.mutate({ data: values }))} className="space-y-5">
                    <FormField control={form.control} name="parentName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-sm">Ім'я батька або мами</FormLabel>
                        <FormControl><Input data-testid="input-parent-name" placeholder="Ваше ім'я" className="h-11 border-2 border-slate-200 rounded-xl focus-visible:ring-[#6366F1]" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-sm">Телефон</FormLabel>
                        <FormControl><Input data-testid="input-phone" type="tel" placeholder="050 123 45 67" className="h-11 border-2 border-slate-200 rounded-xl focus-visible:ring-[#6366F1]" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="childAge" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-sm">Вік дитини</FormLabel>
                        <Select onValueChange={v => field.onChange(Number(v))} defaultValue={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger data-testid="select-child-age" className="h-11 border-2 border-slate-200 rounded-xl">
                              <SelectValue placeholder="Оберіть вік" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[7,8,9,10,11,12,13,14,15,16,17].map(a => <SelectItem key={a} value={a.toString()}>{a} років</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" data-testid="button-submit-lead" disabled={leadMutation.isPending} className="w-full h-14 rounded-xl text-base font-display font-bold btn-3d-amber border-0 py-4">
                      {leadMutation.isPending ? "Відправка…" : "Записатись на безкоштовний урок"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ══ 13. FOOTER ══ */}
      <footer className="bg-[#080E1C] text-slate-400 py-14 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-display font-bold text-xl text-white">ITCodeCraft</span>
                <span className="bg-[#00A2FF] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Roblox Edition</span>
              </div>
              <p className="text-sm max-w-xs leading-relaxed">Школа, де діти не просто грають, а створюють ігри. Практичне навчання в Roblox Studio.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Курс</h4>
              <ul className="space-y-2 text-sm">
                {[["course","Програма"],["games","Галерея ігор"],["mentors","Викладачі"],["faq","FAQ"]].map(([id, label]) => (
                  <li key={id}><button onClick={() => scrollTo(id)} className="hover:text-white transition-colors">{label}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Контакти</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://t.me/itcodecraft" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Telegram</a></li>
                <li><a href="https://instagram.com/itcodecraft" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="mailto:info@itcodecraft.com" className="hover:text-white transition-colors">info@itcodecraft.com</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
            <p>© 2024 ITCodeCraft. Всі права захищені.</p>
            <p className="text-slate-600 text-center md:text-right max-w-md">Roblox® — торгова марка Roblox Corporation. ITCodeCraft не афілійований з Roblox Corporation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
