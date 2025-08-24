const Joi = require('joi');
const { ValidationError } = require('../middleware/errorHandler');

/**
 * Authentication Validators
 * 
 * Joi validation schemas for authentication endpoints
 * Following security best practices from travel platforms
 */

// Common validation patterns
const patterns = {
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .max(255)
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'string.max': 'Email cannot exceed 255 characters'
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'string.empty': 'Password is required'
    }),

  name: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .required()
    .messages({
      'string.min': 'Name must be at least 1 character long',
      'string.max': 'Name cannot exceed 50 characters',
      'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes',
      'string.empty': 'Name is required'
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),

  role: Joi.string()
    .valid('guest', 'host')
    .default('guest')
    .messages({
      'any.only': 'Role must be either guest or host'
    })
};

/**
 * User registration validation
 */
const registerSchema = Joi.object({
  email: patterns.email,
  
  password: patterns.password,
  
  firstName: patterns.name.messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 1 character long',
    'string.max': 'First name cannot exceed 50 characters'
  }),
  
  lastName: patterns.name.messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 1 character long',
    'string.max': 'Last name cannot exceed 50 characters'
  }),
  
  phone: patterns.phone.optional(),
  
  role: patterns.role,
  
  agreeToTerms: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must agree to the terms of service',
      'boolean.base': 'Terms agreement must be a boolean value'
    }),
  
  agreeToPrivacy: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must agree to the privacy policy',
      'boolean.base': 'Privacy agreement must be a boolean value'
    }),

  // Optional referral code
  referralCode: Joi.string()
    .trim()
    .alphanum()
    .min(6)
    .max(20)
    .optional()
    .messages({
      'string.alphanum': 'Referral code must contain only letters and numbers',
      'string.min': 'Referral code must be at least 6 characters long',
      'string.max': 'Referral code cannot exceed 20 characters'
    }),

  // Marketing preferences
  agreeToMarketing: Joi.boolean()
    .default(false)
});

/**
 * User login validation
 */
const loginSchema = Joi.object({
  email: patterns.email,
  
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required'
    }),
  
  rememberMe: Joi.boolean()
    .default(false)
});

/**
 * Profile update validation
 */
const updateProfileSchema = Joi.object({
  firstName: patterns.name.optional(),
  
  lastName: patterns.name.optional(),
  
  phone: patterns.phone.optional(),
  
  profile: Joi.object({
    dateOfBirth: Joi.date()
      .max('now')
      .min('1900-01-01')
      .optional()
      .messages({
        'date.max': 'Date of birth cannot be in the future',
        'date.min': 'Please provide a valid date of birth'
      }),
    
    nationality: Joi.string()
      .trim()
      .max(50)
      .optional()
      .messages({
        'string.max': 'Nationality cannot exceed 50 characters'
      }),
    
    languages: Joi.array()
      .items(Joi.string().trim().max(30))
      .max(10)
      .optional()
      .messages({
        'array.max': 'Maximum 10 languages allowed',
        'string.max': 'Language name cannot exceed 30 characters'
      }),
    
    bio: Joi.string()
      .trim()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Bio cannot exceed 500 characters'
      }),
    
    interests: Joi.array()
      .items(Joi.string().valid(
        'safari', 'hiking', 'rafting', 'cultural', 'wildlife', 
        'photography', 'adventure', 'nature', 'history', 'food',
        'beaches', 'mountains', 'cities', 'rural', 'luxury', 'budget'
      ))
      .max(10)
      .optional()
      .messages({
        'array.max': 'Maximum 10 interests allowed',
        'any.only': 'Invalid interest selected'
      }),
    
    emergencyContact: Joi.object({
      name: Joi.string().trim().max(100).optional(),
      phone: patterns.phone.optional(),
      relationship: Joi.string().trim().max(50).optional()
    }).optional()
  }).optional(),
  
  preferences: Joi.object({
    currency: Joi.string()
      .valid('USD', 'UGX', 'EUR', 'GBP')
      .optional()
      .messages({
        'any.only': 'Currency must be one of: USD, UGX, EUR, GBP'
      }),
    
    language: Joi.string()
      .valid('en', 'sw', 'lg')
      .optional()
      .messages({
        'any.only': 'Language must be one of: en, sw, lg'
      }),
    
    notifications: Joi.object({
      email: Joi.object({
        bookingUpdates: Joi.boolean().optional(),
        promotions: Joi.boolean().optional(),
        newsletter: Joi.boolean().optional(),
        reviews: Joi.boolean().optional()
      }).optional(),
      
      sms: Joi.object({
        bookingUpdates: Joi.boolean().optional(),
        emergencyAlerts: Joi.boolean().optional()
      }).optional(),
      
      push: Joi.object({
        enabled: Joi.boolean().optional(),
        bookingUpdates: Joi.boolean().optional(),
        promotions: Joi.boolean().optional()
      }).optional()
    }).optional(),
    
    accessibility: Joi.object({
      mobilityAssistance: Joi.boolean().optional(),
      dietaryRestrictions: Joi.array()
        .items(Joi.string().valid(
          'vegetarian', 'vegan', 'halal', 'kosher', 
          'gluten-free', 'dairy-free', 'nut-free'
        ))
        .optional(),
      allergies: Joi.array()
        .items(Joi.string().trim().max(50))
        .max(10)
        .optional()
    }).optional()
  }).optional(),
  
  location: Joi.object({
    country: Joi.string()
      .trim()
      .max(50)
      .optional(),
    
    city: Joi.string()
      .trim()
      .max(50)
      .optional(),
    
    coordinates: Joi.object({
      type: Joi.string().valid('Point').default('Point'),
      coordinates: Joi.array()
        .items(
          Joi.number().min(-180).max(180), // longitude
          Joi.number().min(-90).max(90)    // latitude
        )
        .length(2)
        .optional()
    }).optional()
  }).optional()
});

/**
 * Change password validation
 */
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Current password is required'
    }),
  
  newPassword: patterns.password.messages({
    'string.empty': 'New password is required'
  })
});

/**
 * Refresh token validation
 */
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'string.empty': 'Refresh token is required'
    })
});

/**
 * Forgot password validation
 */
const forgotPasswordSchema = Joi.object({
  email: patterns.email
});

/**
 * Reset password validation
 */
const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'string.empty': 'Reset token is required'
    }),
  
  password: patterns.password
});

/**
 * Email verification validation
 */
const verifyEmailSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'string.empty': 'Verification token is required'
    })
});

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {String} property - Request property to validate (body, query, params)
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return next(new ValidationError('Validation failed', validationErrors));
    }

    // Replace the request property with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Export validation middleware for each endpoint
module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateUpdateProfile: validate(updateProfileSchema),
  validateChangePassword: validate(changePasswordSchema),
  validateRefreshToken: validate(refreshTokenSchema),
  validateForgotPassword: validate(forgotPasswordSchema),
  validateResetPassword: validate(resetPasswordSchema),
  validateVerifyEmail: validate(verifyEmailSchema),
  
  // Export schemas for testing
  schemas: {
    registerSchema,
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
    refreshTokenSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyEmailSchema
  }
};