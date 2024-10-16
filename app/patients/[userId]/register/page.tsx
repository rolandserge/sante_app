import RegisterForm from '@/components/forms/registerForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import React from 'react'

export default async function Register({ params : { userId }} : SearchParamProps) {

    const user = await getUser(userId)

    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        alt="Logo du projet"
                        width="1000"
                        height="1000"
                        className="w-fit mb-12 h-10"
                    />

                    <RegisterForm user={user} />

                    <p className="copyright py-12">
                        © 2024 IvoireSanté
                    </p>
                </div>
            </section>

            <Image
                src="/assets/images/register-img.png"
                height={1000}
                width={1000}
                alt="Patient"
                className="side-img max-w-[390px]"
            />
        </div>
    )
}
