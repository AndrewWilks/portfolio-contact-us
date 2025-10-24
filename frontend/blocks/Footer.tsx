import { Link } from "@tanstack/react-router";

interface FooterProps {
  ref?: React.Ref<HTMLDivElement>;
}

export default function Footer({ ref }: FooterProps) {
  return (
    <footer
      ref={ref}
      className="bg-gray-300 text-gray-800 dark:bg-gray-800 dark:text-gray-300 py-4 mt-8"
    >
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <Link to={"/me/"}>Andrew Wilks</Link>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
