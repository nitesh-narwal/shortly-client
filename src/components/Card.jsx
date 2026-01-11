import React from "react";

const Card = ({ title, desc, icon }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      {icon && (
        <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md">
          {icon}
        </div>
      )}
      <h3 className="text-slate-800 text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

export default Card;

