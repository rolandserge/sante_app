import PatientForm from "@/components/forms/patientForm";
import PassKeyModal from "@/components/passKeyModal";
import Image from "next/image";
import Link from "next/link";

export default function Home({ searchParams }: SearchParamProps) {

  const isAdmin = searchParams.admin === "true"

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PassKeyModal />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
            <Image
              src="/assets/icons/logo-full.svg"
              alt="Logo du projet"
              width="1000"
              height="1000"
              className="w-fit mb-12 h-10"
            />

            <PatientForm />

            <div className="text-14-regular mt-20 flex justify-between">
              <p className="justify-items-end text-dark-600 xl:text-left">
                © 2024 IvoireSanté
              </p>
              <Link href="/?admin=true" className="text-green-500">
                Admin
              </Link>
            </div>
        </div>
      </section>

      <Image
          src="/assets/images/onboarding-img.png"
          height={1000}
          width={1000}
          alt="Patient"
          className="side-img max-w-[50%] max-h-screen"
      />
    </div>
  );
}
