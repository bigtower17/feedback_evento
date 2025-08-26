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
    <div className="relative animate-fadeIn max-w-md w-full flex flex-col justify-center min-h-[60vh]">
      <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Conosciamoci meglio</h1>
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
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-custom-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-custom-green-dark transition-colors hover:pulse disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Caricamento...' : 'Inizia il Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationScreen;