import React from 'react';
import BrainIcon from './BrainIcon';

const Header: React.FC = () => {
  return (
    <div className="flex items-center p-4 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm rounded-t-xl">
      <BrainIcon />
      <div className="ml-4">
        <h1 className="text-xl font-bold text-emerald-400">SereneMind AI</h1>
        <p className="text-sm text-slate-400">Your calm guide to clarity</p>
      </div>
    </div>
  );
};

export default Header;