import React from 'react';
import { ArrowLeft } from 'lucide-react';

const AboutPage = ({ onBack }) => ( 
    <div className="p-4 md:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-400 mb-4">Momba ny Fampiharana</h2>
      <p className="text-slate-700 dark:text-slate-300 mb-2">
        Ity dia fampiharana PWA (Progressive Web App) hijerena ireo hira ao amin'ny Fihirana FFPM.
      </p>
      <p className="text-slate-700 dark:text-slate-300 mb-2">
        Namboarina mba ho mora ampiasaina na misy na tsy misy internet (rehefa voatahiry voalohany).
      </p>
      <p className="text-slate-700 dark:text-slate-300">
        Version: 1.4.0 (Separated Concerns)
      </p>
      <button
        onClick={onBack}
        className="mt-6 inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors duration-200"
      >
        <ArrowLeft size={20} className="mr-2" /> Hiverina amin'ny lisitra
      </button>
    </div>
  );

export default AboutPage;
