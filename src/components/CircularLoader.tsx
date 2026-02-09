type Props = {
  size?: number;
  color?: string;
};

export default function CircularLoader({ size = 20, color = "white" }: Props) {
  return (
    <div
      className="inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
      style={{
        width: size,
        height: size,
        color: color,
      }}
      role="status"
    />
  );
}
