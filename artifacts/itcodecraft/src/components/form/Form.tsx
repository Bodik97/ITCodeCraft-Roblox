import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadFormValues } from "./schema";
import { reportError } from "@/lib/reportError";

type FormCopy = {
  submitLabel: string;
  submittingLabel: string;
  successTitle: string;
  successMessage: string;
};

type Props = {
  copy: FormCopy;
};

export default function LeadForm({ copy }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { childAge: 10 },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error(`Lead submit failed: ${res.status}`);
      }

      setSubmitted(true);
      reset();
      window.dispatchEvent(new CustomEvent("itcc:form-success"));
    } catch (error) {
      reportError(error, "lead-form");
      window.dispatchEvent(new CustomEvent("itcc:form-error"));
    }
  });

  if (submitted) {
    return (
      <div className="text-center py-8 space-y-2">
        <p className="text-xl font-display font-bold text-[#00B06F]">{copy.successTitle}</p>
        <p className="text-slate-500 text-sm">{copy.successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="lead-form space-y-5" data-testid="lead-form">
      <div>
        <label htmlFor="parentName">Ім&apos;я батька або мами</label>
        <input
          id="parentName"
          data-testid="input-parent-name"
          placeholder="Ваше ім'я"
          {...register("parentName")}
        />
        {errors.parentName && (
          <p className="field-error">{errors.parentName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone">Телефон</label>
        <input
          id="phone"
          type="tel"
          data-testid="input-phone"
          placeholder="050 123 45 67"
          {...register("phone")}
        />
        {errors.phone && <p className="field-error">{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="childAge">Вік дитини</label>
        <select id="childAge" data-testid="select-child-age" {...register("childAge")}>
          {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((age) => (
            <option key={age} value={age}>
              {age} років
            </option>
          ))}
        </select>
        {errors.childAge && (
          <p className="field-error">{errors.childAge.message}</p>
        )}
      </div>

      <button
        type="submit"
        data-testid="button-submit-lead"
        disabled={isSubmitting}
        className="w-full h-14 rounded-xl text-base font-display font-bold btn-3d-amber border-0"
      >
        {isSubmitting ? copy.submittingLabel : copy.submitLabel}
      </button>
    </form>
  );
}
