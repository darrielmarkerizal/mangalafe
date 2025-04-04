"use client";

const CTAButton = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-secondary text-primary hover:text-white px-6 py-3 rounded-[6px] font-semibold hover:bg-primary transition-colors duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default CTAButton;
