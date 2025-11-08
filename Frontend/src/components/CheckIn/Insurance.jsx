import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const Insurance = () => {
  const [startDate, setStartDate] = useState(null);
  const [formData, setFormData] = useState({
    provider: '',
    policyNumber: '',
    groupNumber: '',
    planType: '',
    insuredName: '',
    insuredDOB: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const combinedInsurance = `${formData.policyNumber} | ${formData.groupNumber} | ${formData.planType}`;

    const submissionData = {
      ...formData,
      combinedInsurance,
    };

    console.log('Insurance info submitted:', submissionData);
  };

  return (
    <div className="flex justify-center items-start px-4 mt-30">
      <form className="w-full max-w-md md:max-w-lg p-4 md:p-6 flex flex-col gap-4 md:gap-5 font-inter" onSubmit={handleSubmit}>
        <h2 className="text-lg md:text-xl font-medium font-roboto text-gray-900">Insurance Information</h2>

        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium text-sm md:text-md">Insurance Provider</label>
          <input
            type="text"
            name="provider"
            placeholder="Blue Cross"
            value={formData.provider}
            onChange={handleChange}
            className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-gray-800 font-medium text-sm md:text-md">Policy Number</label>
            <input
              type="text"
              name="policyNumber"
              placeholder="Policy #"
              value={formData.policyNumber}
              onChange={handleChange}
              className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-gray-800 font-medium text-sm md:text-md">Group Number</label>
            <input
              type="text"
              name="groupNumber"
              placeholder="Group #"
              value={formData.groupNumber}
              onChange={handleChange}
              className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium text-sm md:text-md">Plan Type</label>
          <select
            name="planType"
            value={formData.planType}
            onChange={handleChange}
            className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
            required
          >
            <option value="">Select plan</option>
            <option value="PPO">PPO</option>
            <option value="HMO">HMO</option>
            <option value="EPO">EPO</option>
            <option value="POS">POS</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-gray-800 font-medium text-sm md:text-md">Insured Name</label>
            <input
              type="text"
              name="insuredName"
              placeholder="Full Name"
              value={formData.insuredName}
              onChange={handleChange}
              className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-gray-800 font-medium text-sm md:text-md">Date of Birth</label>
            <input
              type="date"
              name="insuredDOB"
              value={formData.insuredDOB}
              onChange={handleChange}
              className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 cursor-pointer text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-800 font-medium text-sm md:text-md">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="rounded-lg w-full py-1 md:py-2 px-2 md:px-3 text-sm md:text-md text-gray-900 bg-white/30 border border-gray-300 hover:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-50"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-1.5 md:py-2 px-3 rounded-full bg-black hover:bg-gray-900 cursor-pointer text-white text-sm md:text-md font-inter font-medium transition-all duration-50"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
