
interface TProps {
  className: string;
  hasLabel?: boolean;
}

const LogoIcon: React.FC<TProps> = ({ className, hasLabel = true }) => {
  return (

    <span className="text-gradient-primary" style={{
      fontWeight: '900',
      fontSize: 'x-large'
    }}>
      MoveFlow
    </span>
  );
};

export default LogoIcon;
