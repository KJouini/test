export default function Button({ children, className = '', ...props }) {
  return (
    <button className={`tw-btn ${className}`} {...props}>
      {children}
    </button>
  );
}
