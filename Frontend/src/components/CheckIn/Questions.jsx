import React, { useState } from 'react';

export const Questions = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', question: '' });
  };

  return (
    <div className="flex justify-center items-start px-4 mt-30">
      <form className="w-full max-w-md md:max-w-lg p-4 md:p-6 flex flex-col gap-4 md:gap-5 font-inter" onSubmit={handleSubmit}>
        <h2 className="text-lg md:text-xl font-medium font-roboto text-gray-900">Have a Question?</h2>
        <p className="text-xs md:text-sm text-gray-700">
          Your privacy is important to us. Please submit any non-sensitive questions below.
        </p>

        {submitted && <p className="text-green-600 text-xs md:text-sm">Thank you! Your question has been submitted.</p>}

        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium text-sm md:text-md">Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium text-sm md:text-md">Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium text-sm md:text-md">Your Question</label>
          <textarea
            name="question"
            placeholder="Type your question here"
            value={formData.question}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-lg py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-1.5 md:py-2 px-3 rounded-full bg-black hover:bg-gray-900 cursor-pointer text-white text-xs md:text-sm font-inter font-medium transition-all duration-50"
        >
          Submit
        </button>

        <section className="mt-4">
          <h3 className="text-xs md:text-sm font-medium text-gray-900">Frequently Asked Questions</h3>
          <ul className="list-disc list-inside mt-1 text-gray-700 space-y-1 text-xs md:text-sm">
            <li>How do I schedule an appointment?</li>
            <li>What insurance plans do you accept?</li>
            <li>How do you protect my health information?</li>
          </ul>
        </section>
      </form>
    </div>
  );
};
