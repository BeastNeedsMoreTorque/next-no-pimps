import Link from 'next/link';

export default function About() {
  return (
    <>
      <div>This is the about page</div>
      <Link
        className='border border-slate-300 text-slate-300 px-2 py-1 rounded'
        href='/'>
        Home
      </Link>
    </>
  );
}
