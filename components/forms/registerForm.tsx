"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import SubmitButton from "@/components/submitButton"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from '../customFormField'
import { useRouter } from 'next/navigation'
import { FormFieldType } from './patientForm'
import { RadioGroup } from '@radix-ui/react-radio-group'
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from '@/constants'
import { RadioGroupItem } from '../ui/radio-group'
import Image from 'next/image'
import { SelectItem } from '../ui/select'
import FileUploader from '../fileUploader'
import { PatientFormValidation } from '@/lib/validation'
import { registerPatient } from '@/lib/actions/patient.actions'

export default function RegisterForm({ user }: { user: User }) {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

        // 1. Define your form.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
          ...PatientFormDefaultValues,
          name: "",
          email: "",
          phone: ""
        },
    })
    
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {

        setIsLoading(true)

        let formData;

        if(values.identificationDocument && values.identificationDocument.length > 0) {
          const blobFile = new Blob([values.identificationDocument[0]], {
            type: values.identificationDocument[0].type
          })

          formData = new FormData()
          formData.append("blobFile", blobFile)
          formData.append("fileName", values.identificationDocument[0].name)
        }

        try {
            const patientData = {
              ...values,
              userId: user.$id,
              birthDate: new Date(values.birthDate),
              identificationDocument: formData,
            }

            //@ts-ignore
            const patient = await registerPatient(patientData)

            if(patient) router.push(`/patients/${user.$id}/new-appointment`)

        } catch (error) {
          console.log(error)
        }
    }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
            <section className='space-y-4'>
                <h1 className='header'>Bienvenu !</h1>
                <p className='text-dark-700'>Prenez votre premier rendez-vous</p>
            </section>

            <section className='space-y-6'>
                <div className='mb-9 space-y-1'>
                  <h2 className='sub-header'>Information personnel</h2>
                </div>
            </section>

            <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="name"
                label='Full Name'
                placeholder="John Doe"
                iconSrc="/assets/icons/user.svg"
                iconAlt="user"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
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
            </div>

            <div className='flex flex-col gap-6 xl:flex-row'>
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.DATE_PICKER}
                name="birthDate"
                label="Date de naissance"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SKELETON}
                name="gender"
                label="Gender"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup 
                      className='flex h-11 gap-6 xl:justify-between'
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {GenderOptions.map((option) => (
                        <div key={option} className='radio-group'>
                          <RadioGroupItem value={option} id={option} />
                          <label htmlFor={option} className='cursor-pointer'>
                            {option}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </div>

            <div className='flex flex-col gap-6 xl:flex-row'>
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="address"
                label="Address"
                placeholder="Abidjan Koumassi, Cité 147"
                />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="occupation"
                label="Occupation"
                placeholder="Developpeur web"
              />
            </div>

            <div className='flex flex-col gap-6 xl:flex-row'>
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="emergencyContactName"
                label="Emergency contact name"
                placeholder="Guardian's name"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.PHONE_INPUT}
                name="emergencyContactNumber"
                label="Emergency contact Number"
                placeholder="(+225) 01 02 03 04 05"
              />
            </div>

            <section className='space-y-6'>
              <div className='mb-9 space-y-1'>
                <h2 className='sub-header'>Information medicale</h2>
              </div>
            </section>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="primaryPhysician"
              label="Primary Physician"
              placeholder="Select a physician"
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


            <div className='flex flex-col gap-6 xl:flex-row'>
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="insuranceProvider"
                label="Insurance provider"
                placeholder="BlueCross BlueShield"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="insurancePolicyNumber"
                label="Insurance policy number"
                placeholder="ABC1020345"
              />
            </div>
            <div className='flex flex-col gap-6 xl:flex-row'>
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="allergies"
                label="Allergies (if any)"
                placeholder="Peanuts, Penicillin, Pollenn"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="currentMedication"
                label="Current medication (if any)"
                placeholder="Paracetamol 500mg, Atefan"
              />
            </div>

            <div className='flex flex-col gap-6 xl:flex-row'>
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="familyMedicalHistory"
                label="Family medical history"
                placeholder="Maman a un maladie du coeur"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="pastMedicalHistory"
                label="Past medical history"
                placeholder="Paludisme avec infection generale"
              />
            </div>

            <section className='space-y-6'>
              <div className='mb-9 space-y-1'>
                <h2 className='sub-header'>Identification et verification</h2>
              </div>
            </section>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="identificationType"
              label="Identification Type"
              placeholder="Select an identification type"
            >
              {IdentificationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                    {type}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="identificationNumber"
              label="Identification number"
              placeholder="10203459876"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              name="identificationDocument"
              label="Scanned copy of identification document"
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader 
                    files={field.value}
                    onChange={field.onChange} 
                  />
                </FormControl>
              )}
            />

            <section className='space-y-6'>
              <div className='mb-9 space-y-1'>
                <h2 className='sub-header'>Consentement et vie privée</h2>
              </div>
            </section>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.CHECKBOX}
              name="treatmentConsent"
              label="I consen to treatment"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.CHECKBOX}
              name="disclosureConsent"
              label="I consent to disclosure of information"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.CHECKBOX}
              name="privacyConsent"
              label="I consent to privacy policy"
            />

            <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
          </form>
        </Form>
    )
}


