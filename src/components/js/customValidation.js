/* eslint-disable no-undef */
import VeeValidate from 'vee-validate';

/**
 * Get custom validations from fields
 * @param {Array} fields - form fields from blocks
 */
export async function getCustomValidations (fields) {
  if (fields && fields.length) {
    // Loop through the fields and check if the custom validations available
    // eslint-disable-next-line no-unused-vars
    fields.forEach((field, index) => {
      // Check custom validations from field based on type using conditions
      if (field.type !== 'section' && field.custom_validation) {
        getValidationRules(field)
      } else if (field.type === 'section') {
        const controls = field.rule_json.controls;
        if (controls && controls.length) {
          controls.forEach((cntrlField) => {
            if (cntrlField.custom_validation) {
              getValidationRules(cntrlField)
            }
          })
        }
      }
    })
  }
}
/**
 * Get validation rules from the field
 * @param {object} field - field which is having custom validations
 */
function getValidationRules (field) {
  let VALIDATION_RULES;
  try {
    // eslint-disable-next-line no-eval
    eval(`VALIDATION_RULES = ${field.custom_validation}`);
  } catch {
    VALIDATION_RULES = field.custom_validation;
  }
  if (VALIDATION_RULES) {
    addToCustomRules(VALIDATION_RULES);
  }
}
/**
 * Adding custom validation rules to vee - validate
 * @param {String} rule - validation rule object
 */
function addToCustomRules (rule) {
  VeeValidate.Validator.extend(rule.name, {
    getMessage: function (field, args) {
      let MESSAGE;
      // eslint-disable-next-line no-eval
      eval(`MESSAGE = ${rule.messages}`);
      return MESSAGE(field, args);
    },
    validate: (value, args) => {
      try {
        let VALIDATION;
        // eslint-disable-next-line no-eval
        eval(`VALIDATION = ${rule.conditions}`);
        return VALIDATION(value, args);
      } catch (error) {
        return false;
      }
    },
  });
}
