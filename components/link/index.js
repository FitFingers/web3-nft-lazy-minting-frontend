export default function Link({ link, children }) {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
