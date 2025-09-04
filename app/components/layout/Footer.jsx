export default function Footer() {
  return (
    <footer className="bg-secondary-100 text-secondary-700 py-6 text-center mt-12 rounded-xl">
      <div className="container mx-auto">
        &copy; {new Date().getFullYear()} sBTC Payment Gateway. All rights
        reserved.
      </div>
    </footer>
  );
}
