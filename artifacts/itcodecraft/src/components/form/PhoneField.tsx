import PhoneInput from "react-phone-number-input";
import ua from "react-phone-number-input/locale/ua";
import "react-phone-number-input/style.css";
import type { Control, FieldError } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { LeadFormValues } from "./schema";

type Props = {
  control: Control<LeadFormValues>;
  error?: FieldError;
};

export default function PhoneField({ control, error }: Props) {
  return (
    <div>
      <label htmlFor="phone">Телефон</label>
      <Controller
        name="phone"
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <PhoneInput
            id="phone"
            ref={ref}
            international
            defaultCountry="UA"
            countryCallingCodeEditable={false}
            labels={ua}
            placeholder="050 123 45 67"
            className="PhoneInput--lead-form"
            value={value || undefined}
            onChange={(next) => onChange(next ?? "")}
            numberInputProps={{
              "data-testid": "input-phone",
              "aria-invalid": error ? true : undefined,
            }}
          />
        )}
      />
      {error && <p className="field-error">{error.message}</p>}
    </div>
  );
}
