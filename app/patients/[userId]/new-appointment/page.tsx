import AppointmentForm from '@/components/forms/appointmentForm';
import { getPatient } from '@/lib/actions/patient.actions';
import Image from 'next/image';
import React from 'react'

export default async function NewAppointment({ params: { userId }}: SearchParamProps) {

    const patient = await getPatient(userId)

    return (
        <div className="flex h-screen max-h-screen">
          <section className="remove-scrollbar container my-auto">
            <div className="sub-container max-w-[860px] flex-1 justify-between">
                <Image
                  src="/assets/icons/logo-full.svg"
                  alt="Logo du projet"
                  width="1000"
                  height="1000"
                  className="w-fit mb-12 h-10"
                />
    
                <AppointmentForm 
                    type="create"
                    userId={userId}
                    patientId={patient.$id}
                />
    
                  <p className="copyright mt-10 py-12">
                    © 2024 IvoireSanté
                  </p>
                </div>
          </section>
    
          <Image
              src="/assets/images/appointment-img.png"
              height={1000}
              width={1000}
              alt="appointment"
              className="side-img max-w-[390px] bg-bottom"
          />
        </div>
      );
}
