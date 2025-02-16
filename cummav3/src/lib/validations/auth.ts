import * as z from "zod"
import { SECTORS, ENTITY_TYPES, LOOKING_FOR } from '@/lib/constants'
import { INDUSTRIES, STAGES_COMPLETED } from '@/lib/constants/dropdowns'

export const serviceProviderSignUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  serviceProviderType: z.enum([
    "Incubator",
    "Accelerator",
    "Institution/University",
    "Private Coworking Space",
    "Community Space",
    "Cafe"
  ], {
    required_error: "Please select a service provider type",
  }),
  serviceName: z.string().min(1, "Service name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  stateProvince: z.string().min(1, "State/Province is required"),
  zipPostalCode: z.string().min(1, "ZIP/Postal Code is required"),
  primaryContact1Name: z.string().min(1, "Primary contact name is required"),
  primaryContact1Designation: z.string().min(1, "Primary contact designation is required"),
  primaryContactNumber: z.string().min(1, "Primary contact number is required"),
  contact2Name: z.string().optional(),
  contact2Designation: z.string().optional(),
  alternateContactNumber: z.string().optional(),
  alternateEmailId: z.string().email("Please enter a valid email address").optional(),
  websiteUrl: z.string().url("Please enter a valid URL").optional(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
})

export const startupSignUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  startupName: z.string().min(1, "Startup name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  founderName: z.string().min(1, "Founder name is required"),
  founderDesignation: z.string().min(1, "Founder designation is required"),
  entityType: z.enum(ENTITY_TYPES, {
    required_error: "Please select an entity type",
  }),
  teamSize: z.number({
    required_error: "Team size is required",
    invalid_type_error: "Team size must be a number",
  }).min(0, "Team size must be 0 or greater"),
  dpiitNumber: z.string().nullable(),
  industry: z.string({
    required_error: "Please select an industry",
  }).min(1, "Please select an industry"),
  sector: z.string({
    required_error: "Please select a sector",
  }).min(1, "Please select a sector"),
  stagecompleted: z.string({
    required_error: "Please select a stage completed",
  }).min(1, "Please select a stage completed"),
  startupMailId: z.string().email("Please enter a valid startup email address"),
  website: z.string().url("Please enter a valid URL").nullable(),
  linkedinStartupUrl: z
    .string()
    .regex(/^https:\/\/(www\.)?linkedin\.com\/in\/.+$/, "Please enter a valid LinkedIn company URL")
    .nullable(),
  linkedinFounderUrl: z
    .string()
    .regex(/^https:\/\/(www\.)?linkedin\.com\/in\/.+$/, "Please enter a valid LinkedIn profile URL")
    .nullable(),
  lookingFor: z.array(z.enum(LOOKING_FOR)).min(1, "Please select what you're looking for"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
  address: z.string().nullable(),
})

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
}) 