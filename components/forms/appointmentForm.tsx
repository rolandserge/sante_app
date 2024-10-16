"use client"

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import CustomFormField from '../customFormField'
import { FormFieldType } from './patientForm'
import SubmitButton from '../submitButton'
import { z } from "zod"
import { Form } from '../ui/form'
import { SelectItem } from '../ui/select'
import Image from 'next/image'
import { Doctors } from '@/constants'
import { getAppointmentSchema } from '@/lib/validation'
import { createAppointment, updateAppointment } from '@/lib/actions/appointment.actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { Appointment } from '@/types/appwrite.types'

export default function AppointmentForm({ userId, patientId, type, appointment, setOpen } : 
    { 
        userId: string, 
        patientId: string, 
        type: "create" | "cancel" | "schedule", 
        appointment?: Appointment, 
        setOpen: (open: boolean) => void
    }
) {

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const appointmentFormValidation = getAppointmentSchema(type)
        // 1. Define your form.
    const form = useForm<z.infer<typeof appointmentFormValidation>>({
        resolver: zodResolver(appointmentFormValidation),
        defaultValues: {
          primaryPhysician: appointment?.primaryPhysician || "",
          schedule: appointment ? new Date(appointment?.schedule) : new Date(Date.now()),
          reason: appointment?.reason || "",
          note: appointment?.note || "",
          cancellationReason: appointment?.cancellationReason ||  "",
        },
    })
    
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof appointmentFormValidation>) {
        setIsLoading(true)

        let status;

        switch(type) {
            case "schedule":
                status = "scheduled"
                break
            case "cancel":
                status = "cancelled"
                break
            default:
                status = "pending"
                break
        }

        try {
          
            if(type === "create" && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status
                }

                const appointment = await createAppointment(appointmentData)

                if(appointment) {
                    form.reset()
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
                }
            } else {

                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id as string,
                    appointment: {
                        primaryPhysician: values?.primaryPhysician,
                        schedule: new Date(values?.schedule),
                        status: status as Status,
                        cancellationReason: values?.cancellationReason
                    },
                    type
                }

                const updatedAppointment = await updateAppointment(appointmentToUpdate)

                if(updatedAppointment) {
                    setOpen && setOpen(false)
                    form.reset()
                }
            }
        } catch (error) {
          console.log(error)
        }
    }

    let buttonLabel;
    
    switch(type) {
        case "cancel":
            buttonLabel = "Annuler le RDV";
            break;
        case "create":
            buttonLabel = "Creer un RDV";
            break
        case "schedule":
            buttonLabel = "Programmer un RDV";
            break
        default:
            break;
    }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
            {type === "create" && <section className='mb-12 space-y-4'>
                <h1 className='header'>Nouveau rendez-vous</h1>
                <p className='text-dark-700'>Prenez a nouveau rendez-vous en 10 secondes</p>
            </section> }

            {type !== "cancel" && (
                <>
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.SELECT}
                        name="primaryPhysician"
                        label="Doctor"
                        placeholder="Select a doctor"
                    >
                        {Doctors.map((doctor) => (
                            <SelectItem key={doctor.name} value={doctor.name}>
                                <div className='flex cursor-pointer items-center gap-2'>
                                    <Image
                                        src={doctor.image}
                                        width={32} height={32}
                                        alt={doctor.name}
                                        className='rounded-full border border-dark-500'
                                    />
                                <p>{doctor.name}</p>
                                </div>
                            </SelectItem>
                        ))}
                    </CustomFormField>

                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.DATE_PICKER}
                        name="schedule"
                        label="Exlected appointment date"
                        showTimeSelect
                        dateFormat='dd/MM/yyyy - h:mm aa'
                    />

                    <div className='flex flex-col gap-6 xl:flex-row'>
                        <CustomFormField
                            control={form.control}
                            fieldType={FormFieldType.TEXTAREA}
                            name="reason"
                            label="La raison du RDV"
                            placeholder='Entrer la raison du RDV'
                        />
                        <CustomFormField
                            control={form.control}
                            fieldType={FormFieldType.TEXTAREA}
                            name="note"
                            label="Notes"
                            placeholder='Entrer les notes'
                        />
                    </div>
                </>
            )}

            {type === "cancel" && (
                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.TEXTAREA}
                    name="cancellationReason"
                    label="Raison de l'annulation"
                    placeholder="Entrer la raison pour l'annulation"
                />
            )}

            <SubmitButton 
                isLoading={isLoading}
                className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
            >
                {buttonLabel}
            </SubmitButton>
          </form>
        </Form>
    )
}
