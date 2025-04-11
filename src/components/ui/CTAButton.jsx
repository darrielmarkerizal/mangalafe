"use client";

const CTAButton = ({
  children,
  onClick,
  type = "button",
  variant = "white",
  className = "",
}) => {
  const baseStyles =
    "py-3 rounded-[6px] font-semibold transition-colors duration-300";

  const variantStyles = {
    white: "bg-white text-primary hover:bg-primary hover:text-white",
    green: "bg-secondary text-primary hover:bg-primary hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default CTAButton;
