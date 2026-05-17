import { useState } from "react";

type Testimonial = {
  initials: string;
  name: string;
  sub: string;
  text: string;
};

type Props = {
  items: Testimonial[];
};

export default function TestimonialsCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className="max-w-3xl mx-auto fade-in-up">
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((t) => (
            <div key={t.name} className="w-full shrink-0">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mx-1">
                <p className="text-slate-700 text-lg italic leading-relaxed my-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-5">
                  <div className="w-12 h-12 rounded-full bg-[#6366F1]/10 border-2 border-[#6366F1]/20 flex items-center justify-center font-bold text-[#6366F1] shrink-0 text-sm">
                    {t.initials}
                  </div>
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
        <button type="button" onClick={prev} aria-label="Попередній" className="p-2 rounded-full border-2 border-slate-200 hover:border-[#6366F1]">
          ←
        </button>
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Відгук ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all ${i === index ? "w-6 h-2 bg-[#6366F1]" : "w-2 h-2 bg-slate-300"}`}
            />
          ))}
        </div>
        <button type="button" onClick={next} aria-label="Наступний" className="p-2 rounded-full border-2 border-slate-200 hover:border-[#6366F1]">
          →
        </button>
      </div>
    </div>
  );
}
