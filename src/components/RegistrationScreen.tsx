import React, { useState } from 'react';

interface RegistrationData {
  name: string;
  ragionesociale: string;
  email: string;
  phone: string;
  consent: boolean;
}

interface RegistrationScreenProps {
  onRegister: (data: RegistrationData) => void;
  onGoBack: () => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegister, onGoBack }) => {
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    ragionesociale: '',
    email: '',
    phone: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Partial<RegistrationData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationData> = {};
    if (!formData.name.trim()) newErrors.name = 'Il nome è obbligatorio';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Inserisci un\'email valida';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Il telefono è obbligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      onRegister(formData);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors({ ...errors, [name]: '' });
  };

  return (
    <div className="relative animate-fadeIn max-w-md w-full">
      <h1 className="mb-3 text-xl font-bold">Conosciamoci meglio</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Nome e Cognome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Inserisci il tuo nome"
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="ragionesociale" className="block text-gray-700 mb-2">
            Ragione Sociale
          </label>
          <input
            type="text"
            id="ragionesociale"
            name="ragionesociale"
            value={formData.ragionesociale}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Inserisci la tua ragione sociale"
            disabled={isSubmitting}
          />
          {errors.ragionesociale && (
            <p className="text-red-500 text-sm mt-1">{errors.ragionesociale}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Inserisci la tua email"
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 mb-2">
            Telefono
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Inserisci il tuo numero di telefono"
            disabled={isSubmitting}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            className="mr-2"
            disabled={isSubmitting}
          />
          <label htmlFor="consent" className="text-gray-700">
            Accetto {' '}
            <a
              href="https://www.iubenda.com/privacy-policy/20671085"
              className="iubenda-white iubenda-noiframe iubenda-noiframe text-blue-600 hover:underline"
              title="Informativa sulla Privacy"
            >
              Termini e condizioni.
            </a>.
          </label>
        </div>
        {errors.consent && <p className="text-red-500 text-sm mb-4">{errors.consent}</p>}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-custom-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-custom-green-dark transition-colors hover:pulse disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Caricamento...' : 'Procedi al Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationScreen;