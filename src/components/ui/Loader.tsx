
type LoaderProps = {
  size?: 'small' | 'large' | 'medium';
};

export default function Loader({ size = 'medium' }: LoaderProps) {
  return (
    <div 
      className="animate-spin rounded-full border-2 border-current border-t-transparent text-primary"
      style={{ 
        width: size === 'small' ? '1rem' : size === 'large' ? '1.5rem' : '1.25rem',
        height: size === 'small' ? '1rem' : size === 'large' ? '1.5rem' : '1.25rem' 
      }}
      role="status"
      aria-label="Loading"
    >
    </div>
  );
}