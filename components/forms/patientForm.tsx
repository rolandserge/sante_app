"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import SubmitButton from "@/components/submitButton"
import { Form } from "@/components/ui/form"
import CustomFormField from '../customFormField'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/actions/patient.actions'
import { UserFormValidation } from '@/lib/validation'

export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton"
}


export default function PatientForm() {

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
        // 1. Define your form.
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
          name: "",
          email: "",
          phone: ""
        },
    })
    
    // 2. Define a submit handler.
    async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
        setIsLoading(true)

        try {
          const userData = { name, email, phone }
          
          const user = await createUser(userData)

          if(user) router.push(`/patients/${user.$id}/register`)

        } catch (error) {
          console.log(error)
        }
    }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
            <section className='mb-12 space-y-4'>
                <h1 className='header'>Salut me voici !</h1>
                <p className='text-dark-700'>Prenez votre premier rendez-vous</p>
            </section>

            <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="name"
                label="Full Name"
                placeholder="John Doe"
                iconSrc="/assets/icons/user.svg"
                iconAlt="user"
            />
            <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="email"
                label="Email Address"
                placeholder="johndoe.example@gmail.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
            />
            <CustomFormField
                control={form.control}
                fieldType={FormFieldType.PHONE_INPUT}
                name="phone"
                label="Phone Number"
                placeholder="(+225) 01 02 03 04 05"
            />

            <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
          </form>
        </Form>
    )
}


