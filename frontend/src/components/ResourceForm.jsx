import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function ResourceForm({ fields, schema, defaults, onSubmit, submitLabel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: schema ? yupResolver(schema) : undefined, defaultValues: defaults });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field) => (
        <div className={field.full ? 'sm:col-span-2' : ''} key={field.name}>
          <label className="label">{field.label}</label>
          {field.type === 'select' ? (
            <select className="input" {...register(field.name)}>
              <option value="">Select</option>
              {field.options.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea className="input min-h-28" {...register(field.name)} />
          ) : (
            <input className="input" type={field.type || 'text'} {...register(field.name)} />
          )}
          {errors[field.name] && <p className="mt-1 text-xs text-red-600">{errors[field.name].message}</p>}
        </div>
      ))}
      <div className="flex justify-end gap-3 sm:col-span-2">
        <button className="btn-primary" disabled={isSubmitting} type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
