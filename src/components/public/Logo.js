export default function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="150"
      height="37.5"
      className="text-gray-800 fill-current"
    >
      <path d="M20,45 L20,35 Q20,25 30,25 L40,25 L40,15 L60,15 L60,25 L110,25 Q120,25 120,35 L120,45 Z" />
      <circle cx="45" cy="48" r="5" />
      <circle cx="95" cy="48" r="5" />
      <path d="M130,45 L130,15 L140,5 L150,5 L160,15 L160,45 Z" />
      <text x="10" y="10" fontFamily="Arial, sans-serif" fontSize="12" fill="#000">TRAIN.TRAVEL</text>
    </svg>
  );
}
