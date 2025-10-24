import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="bg-gray-300 text-gray-800 dark:bg-gray-800 dark:text-gray-300 py-4 mt-8">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <Link to={"/me/"}>Andrew Wilks</Link>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
