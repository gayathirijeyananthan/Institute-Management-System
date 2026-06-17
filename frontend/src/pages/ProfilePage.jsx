import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Save } from 'lucide-react';
import { api } from '../services/api.js';
import { buildFormData } from '../utils/forms.js';

const fields = [
  { name: 'instituteName', label: 'Institute Name' },
  { name: 'email', label: 'Email' },
  { name: 'phone', label: 'Phone' },
  { name: 'address', label: 'Address' }
];

export default function ProfilePage() {
  const [values, setValues] = useState({});
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get('/institutes/profile');
        setValues(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load profile');
      }
    };
    loadProfile();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = buildFormData({ ...values, logo }, ['logo']);
      const { data } = await api.put('/institutes/profile', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      setValues(data);
      toast.success('Institute profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink">Institute Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Maintain public contact and identity details for your institute.</p>
      </div>
      <form className="rounded-md border border-line bg-white p-5 shadow-soft" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="label">{field.label}</label>
              <input
                className="input"
                value={values[field.name] || ''}
                onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="label">Logo</label>
            <input className="input" type="file" accept="image/*" onChange={(event) => setLogo(event.target.files)} />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button className="btn-primary" disabled={loading} type="submit">
            <Save size={18} />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
