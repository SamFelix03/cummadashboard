import mongoose from 'mongoose'
import { ENTITY_TYPES, LOOKING_FOR } from '@/lib/constants'

const startupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  startupName: {
    type: String,
    required: [true, 'Startup name is required'],
    minLength: 1,
  },
  contactName: {
    type: String,
    required: [true, 'Contact name is required'],
    minLength: 1,
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    minLength: 1,
  },
  founderName: {
    type: String,
    required: [true, 'Founder name is required'],
    minLength: 1,
  },
  founderDesignation: {
    type: String,
    required: [true, 'Founder designation is required'],
    minLength: 1,
  },
  entityType: {
    type: String,
    enum: ENTITY_TYPES,
    required: [true, 'Entity type is required'],
  },
  teamSize: {
    type: Number,
    required: [true, 'Team size is required'],
    min: 0,
    get: (v: number) => Math.round(v),
    set: (v: number) => Math.round(v),
  },
  dpiitNumber: {
    type: String,
    default: null,
    validate: {
      validator: function(v: string | null) {
        if (!v) return true // Allow null
        return v.length >= 1
      },
      message: 'DPIIT number must be at least 1 character long'
    }
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    minLength: 1,
  },
  sector: {
    type: String,
    required: [true, 'Sector is required'],
    minLength: 1,
  },
  stagecompleted: {
    type: String,
    required: [true, 'Stage completed is required'],
    minLength: 1,
  },
  startupMailId: {
    type: String,
    required: [true, 'Startup email is required'],
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'],
  },
  website: {
    type: String,
    default: null,
    validate: {
      validator: function(v: string | null) {
        if (!v) return true // Allow null
        return /^(https?:\/\/)?([a-z0-9.-]+)\.([a-z.]{2,6})(\/[\w .-]*)*\/?$/.test(v)
      },
      message: 'Invalid website URL format'
    }
  },
  linkedinStartupUrl: {
    type: String,
    default: null,
    validate: {
      validator: function(v: string | null) {
        if (!v) return true // Allow null
        return /^https:\/\/(www\.)?linkedin\.com\/in\/.+$/.test(v)
      },
      message: 'Invalid LinkedIn company URL format'
    }
  },
  linkedinFounderUrl: {
    type: String,
    default: null,
    validate: {
      validator: function(v: string | null) {
        if (!v) return true // Allow null
        return /^https:\/\/(www\.)?linkedin\.com\/in\/.+$/.test(v)
      },
      message: 'Invalid LinkedIn profile URL format'
    }
  },
  lookingFor: {
    type: [String],
    enum: LOOKING_FOR,
    default: null,
    validate: {
      validator: function(v: string[] | null) {
        if (!v) return true // Allow null
        return v.every(item => item.length >= 1)
      },
      message: 'Each lookingFor value must be at least 1 character long'
    }
  },
  address: {
    type: String,
    default: null,
  },
  logoUrl: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  collection: 'Startups'
})

// Update timestamps on save
startupSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

// Export the model
export default mongoose.models.Startups || mongoose.model('Startups', startupSchema, 'Startups') 