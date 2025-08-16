import Link from 'next/link';

export default function TrainLogo({ lang }) {
  return (
    <Link href={`/${lang}`} className="flex items-center gap-3">
      {/* A more professional-looking, abstract train icon */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-cyan-600"
      >
        <path
          d="M4 15.5C4 14.1193 5.11929 13 6.5 13H17.5C18.8807 13 20 14.1193 20 15.5V19.5C20 20.8807 18.8807 22 17.5 22H6.5C5.11929 22 4 20.8807 4 19.5V15.5Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M7 13V8.9918C7 8.44391 7.44772 8 8 8H16C16.5523 8 17 8.44975 17 9.0082V13"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M10 8V4M14 8V4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M2 18H22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-2xl font-bold text-gray-800 tracking-wider">
        TRAIN.TRAVEL
      </span>
    </Link>
  );
}
