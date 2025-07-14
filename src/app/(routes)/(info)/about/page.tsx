import { SiteNav } from "@/components/main/home/site-nav";
import { Button } from "@/components/ui/button";
import { siteMetadata } from "@/data/siteMetadata";
import { Mail } from "lucide-react";
import Link from "next/link";

const About = () => {
  return (
    <>
      <SiteNav />
      <div className="text-sm mt-20 text-justify sm:px-32 px-3 leading-7 sm:text-base mx-auto p-4 dark:text-slate-300">
        <h1 className="sm:text-2xl text-xl font-semibold mb-4">About</h1>

        <p className="mb-4">
          Showfolio is your all-in-one solution for managing and
          sharing resumes and portfolio. Whether you’re an aspiring
          professional or a seasoned expert, our platform makes it easy to
          create, manage, and share your resumes and portfolio in a beautiful
          and customizable way.
        </p>

        <h2 className="text-xl font-semibold mb-2">Why It&apos;s Handy</h2>
        <p className="mb-4">
          Instead of sending multiple files or links, create a single, clean and
          customizable portfolio website that showcases your skills, experience,
          and work. Share it easily with potential employers or clients. Whether
          it’s a resume or a full-fledged portfolio, everything you need to
          impress is in one place.
        </p>

        <h2 className="text-xl font-semibold mb-2">What You Get</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Full portfolio customization</li>
          <li> Create and share your resume online</li>
          <li> Share via custom links</li>
          <li> Track performance with resume analytics</li>
          <li> Quick setup with easy-to-use templates</li>
        </ul>

        <p className="mb-4">
          Whether you’re looking to showcase your work or organize your job
          applications, Showfolio helps you stay organized,
          professional, and ready to share your best self.
        </p>

        <h2 className="text-xl font-semibold mb-2">Let&apos;s Connect</h2>
        <p className="mb-4">
          Have feedback or just want to chat? Feel free to reach out anytime,
          we’re always happy to connect!
        </p>

        <p className="flex items-center gap-x-6">
          <Link target="_blank" href={siteMetadata.contact_about}>
            <Button size="sm" className="flex items-center gap-x-2 mb-4">
              <Mail size={16} />
              Contact
            </Button>
          </Link>
        </p>
      </div>
    </>
  );
};

export default About;
